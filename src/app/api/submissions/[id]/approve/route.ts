import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import type { GradeCriterionScore } from "@/types/grade.types";

export const runtime = "nodejs";

interface ApprovePayload {
  final_criterion_scores: GradeCriterionScore[];
  final_total_score: number;
  final_feedback: string;
  edited_from_ai: boolean;
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as ApprovePayload;
  if (!body?.final_criterion_scores || body.final_total_score == null || !body.final_feedback) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: teacher, error: teacherErr } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (teacherErr) return NextResponse.json({ error: teacherErr.message }, { status: 500 });
  if (!teacher?.id) return NextResponse.json({ error: "Teacher profile not found" }, { status: 403 });

  const { data: submission, error: subErr } = await supabase
    .from("submissions")
    .select("*, students(parent_whatsapp_number, student_whatsapp_number, name, full_name)")
    .eq("id", id)
    .single();

  if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });

  const { error: gradeErr } = await supabase.from("final_grades").insert({
    submission_id: id,
    teacher_id: teacher.id,
    final_criterion_scores: body.final_criterion_scores,
    final_total_score: body.final_total_score,
    final_feedback: body.final_feedback,
    edited_from_ai: body.edited_from_ai ?? false,
  });

  if (gradeErr) return NextResponse.json({ error: gradeErr.message }, { status: 500 });

  const { error: statusErr } = await supabase
    .from("submissions")
    .update({ status: "approved" })
    .eq("id", id);

  if (statusErr) return NextResponse.json({ error: statusErr.message }, { status: 500 });

  const student = submission.students as {
    parent_whatsapp_number?: string | null;
    student_whatsapp_number?: string | null;
    name?: string | null;
    full_name?: string | null;
  } | null;

  const whatsappTo =
    student?.student_whatsapp_number || student?.parent_whatsapp_number || process.env.WHATSAPP_TEST_NUMBER;

  if (whatsappTo) {
    const studentName = student?.full_name || student?.name || "Student";
    const message = `Grade approved for ${studentName}\n\nScore: ${body.final_total_score}\n\nFeedback:\n${body.final_feedback}`;
    try {
      await sendWhatsAppMessage(whatsappTo, message);
    } catch (err) {
      console.error("WhatsApp delivery failed:", err);
    }
  }

  return NextResponse.json({
    success: true,
    submission_id: id,
    assignment_id: submission.assignment_id,
    status: "approved",
  });
}
