import { Song } from "@/types/Song";
import { createClient } from "@/utils/supabase/clients/client";

export async function updateSong(song: Song) {
  const supabase = await createClient();

  console.log("song", song);
  const { data, error } = await supabase
    .from("songs")
    .update(song)
    .eq("id", song.id);

  if (error) {
    console.error("Error in updateSong:", error);

    const errorMessage = error instanceof Error 
      ? error.message 
      : JSON.stringify(error, Object.getOwnPropertyNames(error));

    throw new Error("Error updating song: " + errorMessage);
  }

  return data;
}
