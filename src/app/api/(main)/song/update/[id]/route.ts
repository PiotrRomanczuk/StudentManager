import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>,
) {
  const supabase = await createClient();
  const body = await request.json();
  const { params } = await contextPromise;
  const { id } = params;

  // Use id from params instead of body.id
  const { data: existingData } = await supabase
    .from("songs")
    .select()
    .eq("id", id)
    .single();

  if (!existingData) {
    return NextResponse.json(
      { error: "No song found with the specified ID" },
      { status: 404 },
    );
  }

  const updateData = {
    title: body.title,
    author: body.author,
    level: body.level,
    key: body.key,
    chords: body.chords,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("songs")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: "No song was updated" }, { status: 404 });
  }

  return NextResponse.json({ data: data[0] }, { status: 200 });
}