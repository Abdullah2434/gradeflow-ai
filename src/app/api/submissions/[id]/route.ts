import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createSupabaseServerClient();

  const { data: submission, error } = await supabase
    .from("submissions")
    .select(
      "*, students(id, name, full_name, parent_whatsapp_number, student_whatsapp_number), assignments(id, title, rubric_json, class_id)"
    )
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: aiGrade, error: gradeErr } = await supabase
    .from("ai_grades")
    .select("*")
    .eq("submission_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (gradeErr) return NextResponse.json({ error: gradeErr.message }, { status: 500 });

  return NextResponse.json({ submission, ai_grade: aiGrade });
}
