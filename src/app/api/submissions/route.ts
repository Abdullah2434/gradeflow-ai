import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { extractTextFromSubmission } from "@/lib/extraction";
import { callClaudeForGrading } from "@/lib/grading";
import type { CreateSubmissionPayload } from "@/types/submission.types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("assignmentId");

  if (!assignmentId) {
    return NextResponse.json({ error: "assignmentId is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("*, students(id, name, full_name, parent_whatsapp_number, student_whatsapp_number)")
    .eq("assignment_id", assignmentId)
    .order("submitted_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

async function replaceExistingSubmission(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  submissionId: string,
  body: CreateSubmissionPayload,
) {
  await supabase.from("final_grades").delete().eq("submission_id", submissionId);
  await supabase.from("ai_grades").delete().eq("submission_id", submissionId);

  const { error: updateErr } = await supabase
    .from("submissions")
    .update({
      file_url: body.file_url,
      file_type: body.file_type,
      extracted_text: null,
      status: "pending_extraction",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (updateErr) throw new Error(updateErr.message);
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const body = (await req.json()) as CreateSubmissionPayload;
    if (!body?.assignment_id || !body?.student_id || !body?.file_url || !body?.file_type) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { data: existing, error: existingErr } = await supabase
      .from("submissions")
      .select("id, status")
      .eq("assignment_id", body.assignment_id)
      .eq("student_id", body.student_id)
      .maybeSingle();

    if (existingErr) return NextResponse.json({ error: existingErr.message }, { status: 500 });

    if (existing?.status === "approved") {
      return NextResponse.json(
        { error: "This assignment is already approved. Resubmission is not allowed." },
        { status: 409 },
      );
    }

    let submissionId: string;
    let resubmitted = false;

    if (existing) {
      resubmitted = true;
      submissionId = existing.id;
      await replaceExistingSubmission(supabase, existing.id, body);
    } else {
      const { data: submission, error: insertErr } = await supabase
        .from("submissions")
        .insert({
          assignment_id: body.assignment_id,
          student_id: body.student_id,
          file_url: body.file_url,
          file_type: body.file_type,
          status: "pending_extraction",
        })
        .select("id")
        .single();

      if (insertErr) {
        if (insertErr.message.includes("duplicate key")) {
          const { data: raceExisting, error: raceErr } = await supabase
            .from("submissions")
            .select("id, status")
            .eq("assignment_id", body.assignment_id)
            .eq("student_id", body.student_id)
            .single();

          if (raceErr || !raceExisting) {
            return NextResponse.json({ error: insertErr.message }, { status: 500 });
          }
          if (raceExisting.status === "approved") {
            return NextResponse.json(
              { error: "This assignment is already approved. Resubmission is not allowed." },
              { status: 409 },
            );
          }

          resubmitted = true;
          submissionId = raceExisting.id;
          await replaceExistingSubmission(supabase, raceExisting.id, body);
        } else {
          return NextResponse.json({ error: insertErr.message }, { status: 500 });
        }
      } else {
        submissionId = submission.id;
      }
    }

    const { data: assignment, error: assignmentErr } = await supabase
      .from("assignments")
      .select("id, rubric_json, teacher_id, teachers ( feedback_tone )")
      .eq("id", body.assignment_id)
      .single();

    if (assignmentErr) return NextResponse.json({ error: assignmentErr.message }, { status: 500 });

    const extractedText = await extractTextFromSubmission({
      file_type: body.file_type,
      file_url: body.file_url,
      pasted_text: body.pasted_text,
    });

    const { error: updateTextErr } = await supabase
      .from("submissions")
      .update({ extracted_text: extractedText, status: "pending_ai_grade" })
      .eq("id", submissionId);
    if (updateTextErr) return NextResponse.json({ error: updateTextErr.message }, { status: 500 });

    const feedbackTone = (() => {
      const teacherJoin = (assignment as unknown as { teachers?: unknown }).teachers;
      if (!teacherJoin || typeof teacherJoin !== "object") return "encouraging";
      const tone = (teacherJoin as { feedback_tone?: unknown }).feedback_tone;
      return typeof tone === "string" ? tone : "encouraging";
    })();

    const grade = await callClaudeForGrading(extractedText, assignment.rubric_json, feedbackTone);

    const { error: aiErr } = await supabase.from("ai_grades").insert({
      submission_id: submissionId,
      criterion_scores: grade.criterion_scores,
      total_score: grade.total_score,
      strengths: grade.strengths,
      areas_to_improve: grade.areas_to_improve,
      suggested_comment: grade.suggested_comment,
      confidence: grade.confidence,
      model_version: "claude-sonnet-4-6",
    });
    if (aiErr) return NextResponse.json({ error: aiErr.message }, { status: 500 });

    const nextStatus =
      grade.confidence === "low" ? "flagged_low_confidence" : "pending_teacher_review";
    const { error: statusErr } = await supabase
      .from("submissions")
      .update({ status: nextStatus })
      .eq("id", submissionId);
    if (statusErr) return NextResponse.json({ error: statusErr.message }, { status: 500 });

    return NextResponse.json({
      submission_id: submissionId,
      status: nextStatus,
      resubmitted,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submission processing failed";
    console.error("POST /api/submissions failed:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
