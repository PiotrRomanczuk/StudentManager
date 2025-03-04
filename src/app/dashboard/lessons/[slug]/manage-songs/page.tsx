import type { Song } from "@/types/Song"
import { createClient } from "@/utils/supabase/clients/server"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Params = { slug: string }

export default async function Page({ params }: { params: Params }) {
  const { slug } = params
  console.log("Resolved Params:", slug)

  const supabase = await createClient()

  const { data: songs, error } = await supabase.from("songs").select("*")

  const { data: lessonSongs, error: lessonSongsError } = await supabase
    .from("lesson_songs")
    .select("song_id")
    .eq("lesson_id", slug)

  const assignedSongIds = lessonSongs?.map((ls: { song_id: string }) => ls.song_id) || []

  // Server action to add a song to a lesson
  async function addSongToLesson(formData: FormData) {
    "use server"

    const songId = formData.get("songId") as string
    if (!songId) return

    const supabase = await createClient()

    const { error: lessonError } = await supabase.from("lesson_songs").insert({
      lesson_id: slug,
      song_id: songId,
    })

    if (lessonError) {
      console.error("Error inserting lesson song:", lessonError.message || lessonError)
      return
    }

    revalidatePath(`/lessons/${slug}/manage-songs`)
  }

  // Server action to remove a song from a lesson
  async function removeSongFromLesson(formData: FormData) {
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
      console.error("Error removing lesson song:", lessonError.message || lessonError)
      return
    }

    revalidatePath(`/lessons/${slug}/manage-songs`)
  }

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Manage Songs for Lesson {slug}</h1>

      {(error || lessonSongsError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.message || lessonSongsError?.message || "Failed to load data"}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Add Song to Lesson</h2>
          <form action={addSongToLesson} className="flex items-end gap-4">
            <div className="flex-1">
              <Select name="songId">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a song" />
                </SelectTrigger>
                <SelectContent>
                  {songs
                    ?.filter((song: Song) => !assignedSongIds.includes(song.id))
                    .map((song: Song) => (
                      <SelectItem key={song.id} value={song.id}>
                        {song.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Add Song</Button>
          </form>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Assigned Songs</h2>
          {assignedSongIds.length === 0 ? (
            <p className="text-muted-foreground">No songs assigned to this lesson yet.</p>
          ) : (
            <ul className="space-y-2">
              {songs
                ?.filter((song) => assignedSongIds.includes(song.id))
                .map((song: Song) => (
                  <li key={song.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span>{song.title}</span>
                    <form action={removeSongFromLesson}>
                      <input type="hidden" name="songId" value={song.id} />
                      <Button variant="destructive" size="sm" type="submit">
                        Remove
                      </Button>
                    </form>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

