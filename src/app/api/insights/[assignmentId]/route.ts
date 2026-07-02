import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_req: Request, ctx: { params: Promise<{ assignmentId: string }> }) {
  const { assignmentId } = await ctx.params;

  if (!UUID_RE.test(assignmentId)) {
    return NextResponse.json({ error: "Invalid assignment ID" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("class_insights")
    .select("*")
    .eq("assignment_id", assignmentId)
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
