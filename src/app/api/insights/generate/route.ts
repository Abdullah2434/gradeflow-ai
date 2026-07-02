import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const body = (await req.json()) as { assignmentId?: string };

  if (!body.assignmentId) {
    return NextResponse.json({ error: "assignmentId is required" }, { status: 400 });
  }

  const { data: assignment, error: assignmentErr } = await supabase
    .from("assignments")
    .select("id, class_id, title, rubric_json")
    .eq("id", body.assignmentId)
    .single();

  if (assignmentErr) return NextResponse.json({ error: assignmentErr.message }, { status: 500 });

  const { data: submissions, error: subErr } = await supabase
    .from("submissions")
    .select("id")
    .eq("assignment_id", body.assignmentId)
    .eq("status", "approved");

  if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });

  const submissionIds = (submissions ?? []).map((s) => s.id);
  if (submissionIds.length === 0) {
    return NextResponse.json({ error: "No approved submissions yet" }, { status: 400 });
  }

  const { data: finalGrades, error: gradesErr } = await supabase
    .from("final_grades")
    .select("final_criterion_scores, final_total_score")
    .in("submission_id", submissionIds);

  if (gradesErr) return NextResponse.json({ error: gradesErr.message }, { status: 500 });

  const rubric = assignment.rubric_json as Array<{ criterion: string; max_points: number }>;
  const aggregates = new Map<string, { total: number; count: number; max: number }>();

  for (const criterion of rubric) {
    aggregates.set(criterion.criterion, { total: 0, count: 0, max: criterion.max_points });
  }

  const areasToImprove: string[] = [];

  for (const grade of finalGrades ?? []) {
    const scores = grade.final_criterion_scores as Array<{
      criterion: string;
      score: number;
      max: number;
    }>;
    for (const s of scores) {
      const agg = aggregates.get(s.criterion);
      if (agg) {
        agg.total += s.score;
        agg.count += 1;
      }
    }
  }

  const { data: aiGrades } = await supabase
    .from("ai_grades")
    .select("areas_to_improve")
    .in("submission_id", submissionIds);

  for (const g of aiGrades ?? []) {
    if (g.areas_to_improve) areasToImprove.push(g.areas_to_improve);
  }

  const criteriaAverages = Array.from(aggregates.entries()).map(([criterion, agg]) => ({
    criterion,
    average: agg.count ? agg.total / agg.count : 0,
    max: agg.max,
    pct: agg.count && agg.max ? (agg.total / agg.count / agg.max) * 100 : 0,
  }));

  criteriaAverages.sort((a, b) => a.pct - b.pct);
  const weakCriteria = criteriaAverages.slice(0, 3);

  let commonErrors = "Not enough data to summarize common errors.";
  if (areasToImprove.length > 0 && process.env.ANTHROPIC_API_KEY) {
    const prompt = `Summarize the most common errors across these student feedback notes in 2-3 plain sentences for a teacher planning their next lesson:\n\n${areasToImprove.join("\n---\n")}`;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { content?: Array<{ text?: string }> };
      commonErrors = (data.content ?? []).map((c) => c.text || "").join("").trim() || commonErrors;
    }
  } else if (areasToImprove.length > 0) {
    commonErrors = areasToImprove.slice(0, 3).join(" ");
  }

  const { data: insight, error: insertErr } = await supabase
    .from("class_insights")
    .insert({
      class_id: assignment.class_id,
      assignment_id: body.assignmentId,
      weak_criteria: weakCriteria,
      common_errors: commonErrors,
    })
    .select("*")
    .single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json(insight, { status: 201 });
}
