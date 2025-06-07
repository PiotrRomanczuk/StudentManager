import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  console.log("id", id);

  const supabase = await createClient();
  const { data: song, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !song) {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }

  return NextResponse.json(song);
}
