import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const body = (await req.json()) as { filename?: string; contentType?: string };

  if (!body.filename) {
    return NextResponse.json({ error: "filename is required" }, { status: 400 });
  }

  const path = `${Date.now()}-${body.filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const { data, error } = await supabase.storage.from("submissions").createSignedUploadUrl(path);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: publicData } = supabase.storage.from("submissions").getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl: publicData.publicUrl,
  });
}
