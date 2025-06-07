"use server";

import { Song } from "@/types/Song";
import { createClient } from "@/utils/supabase/clients/client";

export async function updateSong(song: Song) {
  console.log("song", song);

  const supabase = createClient();

  const { data, error } = await supabase
    .from("songs")
    .update(song)
    .eq("id", song.id);

  if (error) {
    console.log("error", error);
    throw error;
  }

  console.log("data", data);
}
