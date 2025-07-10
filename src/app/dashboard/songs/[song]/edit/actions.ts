"use server";

import { Song } from "@/types/Song";
import { createClient } from "@/utils/supabase/clients/server";
import { revalidatePath } from "next/cache";
import { createGuid } from "@/utils/createGuid";

export async function updateSong(song: Song) {
  try {
    const supabase = await createClient();

    // First check if the song exists
    const { data: existingData } = await supabase
      .from("songs")
      .select()
      .eq("id", song.id)
      .single();

    if (!existingData) {
      console.error(`Song with ID ${song.id} not found in database`);
      throw new Error("No song found with the specified ID");
    }

    // Create a clean update object with only the fields we want to update
    const updateData = {
      title: song.title,
      author: song.author,
      level: song.level,
      key: song.key,
      chords: song.chords,
      audio_files: song.audio_files,
      ultimate_guitar_link: song.ultimate_guitar_link,
      short_title: song.short_title,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("songs")
      .update(updateData)
      .eq("id", song.id)
      .select();

    if (error) {
      console.error("Error updating song", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.error("No song was updated. ID:", song.id);
      throw new Error("No song was updated");
    }

    const updatedSong = data[0];
    revalidatePath(`/dashboard/songs/${song.id}`);

    return { success: true, data: updatedSong };
  } catch (error) {
    console.error("Error in updateSong:", error);
    throw error;
  }
}

export async function createSong(song: Partial<Song>) {
  try {
    const supabase = await createClient();

    const newSong = {
      id: createGuid(),
      title: song.title || "",
      author: song.author || "",
      level: song.level || "beginner",
      key: song.key || "",
      chords: song.chords,
      audio_files: song.audio_files,
      ultimate_guitar_link: song.ultimate_guitar_link,
      short_title: song.short_title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("songs")
      .insert([newSong])
      .select()
      .single();

    if (error) {
      console.error("Error creating song", error);
      throw new Error(error.message);
    }

    if (!data) {
      console.error("No song was created");
      throw new Error("No song was created");
    }

    revalidatePath("/dashboard/songs");
    return { success: true, data };
  } catch (error) {
    console.error("Error in createSong:", error);
    throw error;
  }
}
