import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CreateAssignmentPayload } from "@/types/assignment.types";

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");

  if (!classId) return NextResponse.json({ error: "classId is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as CreateAssignmentPayload;
  if (!body?.class_id || !body?.title || !Array.isArray(body?.rubric_json)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: teacher, error: teacherErr } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (teacherErr) return NextResponse.json({ error: teacherErr.message }, { status: 500 });
  if (!teacher?.id) return NextResponse.json({ error: "Teacher profile not found" }, { status: 403 });

  const { data, error } = await supabase
    .from("assignments")
    .insert({
      class_id: body.class_id,
      teacher_id: teacher.id,
      title: body.title,
      description: body.description ?? null,
      due_date: body.due_date ?? null,
      rubric_json: body.rubric_json,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

