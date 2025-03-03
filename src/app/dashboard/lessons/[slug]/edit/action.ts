import { createClient } from "@/utils/supabase/clients/server";

export async function updateLesson(formData: FormData) {
  "use server";
  const supabase = await createClient();

  const songId = formData.get("songs") as string;
  const notes = formData.get("notes") as string;

  const { error: lessonSongError } = await supabase
    .from("lesson_songs")
    .update({
      song_id: songId,
      lesson_id: formData.get("slug") as string,
    });

  if (lessonSongError) {
    console.error("Error updating lesson song:", lessonSongError);
    return { success: false, lessonSongError };
  }

  const { error: lessonError } = await supabase
    .from("lessons")
    .update({ notes })
    .eq("slug", formData.get("slug"));

  if (lessonError) {
    console.error("Error updating lesson:", lessonError);
    return { success: false, lessonError };
  }

  return { success: true };
}
