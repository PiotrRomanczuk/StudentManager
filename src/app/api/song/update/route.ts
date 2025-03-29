import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  // First check if the song exists
  const { data: existingData } = await supabase
    .from("songs")
    .select()
    .eq("id", body.id)
    .single();

  // console.log("existingData", existingData);

  if (!existingData) {
    console.error(`Song with ID ${body.id} not found in database`);
    return NextResponse.json(
      { error: "No song found with the specified ID" },
      { status: 404 },
    );
  }

  // console.log("Attempting to update song with body:", body);

  // Create a clean update object with only the fields we want to update
  const updateData = {
    title: body.title,
    author: body.author,
    level: body.level,
    key: body.key,
    chords: body.chords,
    updated_at: new Date().toISOString(),
  };

  // console.log("Clean update data:", updateData);

  const { data, error } = await supabase
    .from("songs")
    .update(updateData)
    .eq("id", body.id)
    .select();

  if (error) {
    console.error("Error updating song", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Check if we got any data back (data will be an array)
  if (!data || data.length === 0) {
    console.error("No song was updated. ID:", body.id);
    return NextResponse.json({ error: "No song was updated" }, { status: 404 });
  }

  const updatedSong = data[0]; // Get the first (and should be only) updated song
  // console.log("Updated song data:", updatedSong);

  // console.log(
  //   `Song updated successfully: ${updatedSong.title || "Unknown title"}`,
  // );
  return NextResponse.json({ data: updatedSong }, { status: 200 });
}
