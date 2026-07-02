import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 401 });
  if (!user) return NextResponse.json({ user: null, teacher: null });

  const { data: teacher, error } = await supabase
    .from("teachers")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ user: { id: user.id, email: user.email }, teacher });
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 401 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { full_name?: string; feedback_tone?: string };
  const fullName = body.full_name?.trim() || user.email?.split("@")[0] || "Teacher";

  const { data: existing } = await supabase
    .from("teachers")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existing) return NextResponse.json(existing);

  const { data, error } = await supabase
    .from("teachers")
    .insert({
      auth_user_id: user.id,
      full_name: fullName,
      name: fullName,
      feedback_tone: body.feedback_tone ?? "encouraging",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
