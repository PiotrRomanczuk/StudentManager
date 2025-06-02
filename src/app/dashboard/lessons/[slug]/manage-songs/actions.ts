"use server";

import { createClient } from "@/utils/supabase/clients/server";
import { revalidatePath } from "next/cache";

export async function addSongToLesson(formData: FormData, slug: string) {
  const songId = formData.get("songId") as string;
  if (!songId) return;

  const supabase = await createClient();

  const { error: lessonError } = await supabase.from("lesson_songs").insert({
    lesson_id: slug,
    song_id: songId,
  });

  if (lessonError) {
    throw new Error(
      "Error inserting lesson song:" + lessonError.message || lessonError,
    );
  }

  revalidatePath(`/lessons/${slug}/manage-songs`);
}

export async function removeSongFromLesson(formData: FormData, slug: string) {
  const songId = (formData.get("songId") as string).trim();
  const trimmedSlug = slug.trim();

  if (!songId) {
    console.error("No songId found in formData");
    return;
  }

  const supabase = await createClient();

  // Log the current state of the lesson_songs table for debugging
  const { error: fetchError } = await supabase
    .from("lesson_songs")
    .select("*")
    .eq("lesson_id", trimmedSlug)
    .eq("song_id", songId);

  if (fetchError) {
    console.error(
      "Error fetching current lesson songs:",
      fetchError.message || fetchError,
    );
  }

  console.log(
    `Attempting to delete song with ID ${songId} from lesson ${trimmedSlug}`,
  );

  const { error: lessonError } = await supabase
    .from("lesson_songs")
    .delete({ returning: "representation" })
    .eq("lesson_id", trimmedSlug)
    .eq("song_id", songId);

  if (lessonError) {
    console.error(
      "Error removing lesson song:",
      lessonError.message || lessonError,
    );
    throw new Error(
      "Error removing lesson song:" + lessonError.message || lessonError,
    );
  } else {
    console.log(
      `Successfully removed song with ID ${songId} from lesson ${trimmedSlug}`,
    );
  }

  revalidatePath(`/lessons/${trimmedSlug}/manage-songs`);
}
