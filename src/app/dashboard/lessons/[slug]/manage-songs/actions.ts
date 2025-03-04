import { createClient } from "@/utils/supabase/clients/server"
import { revalidatePath } from "next/cache"

export async function addSongToLesson(formData: FormData, slug: string) {
  "use server"

  const songId = formData.get("songId") as string
  if (!songId) return

  const supabase = await createClient()

  const { error: lessonError } = await supabase.from("lesson_songs").insert({
    lesson_id: slug,
    song_id: songId,
  })

  if (lessonError) {
    throw new Error("Error inserting lesson song:" + lessonError.message || lessonError)
  }

  revalidatePath(`/lessons/${slug}/manage-songs`)
}

export async function removeSongFromLesson(formData: FormData, slug: string) {
  "use server"

  const songId = formData.get("songId") as string
  if (!songId) return

  const supabase = await createClient()

  const { error: lessonError } = await supabase
    .from("lesson_songs")
    .delete()
    .eq("lesson_id", slug)
    .eq("song_id", songId)

  if (lessonError) {
    throw new Error("Error removing lesson song:" + lessonError.message || lessonError)
  }

  revalidatePath(`/lessons/${slug}/manage-songs`)
}