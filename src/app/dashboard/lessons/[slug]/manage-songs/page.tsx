import { createClient } from "@/utils/supabase/clients/server";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AddSongForm from "./AddSongForm";
import AssignedSongsList from "./AssignedSongsList";

type Params = { slug: string };

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: songs, error } = await supabase.from("songs").select("*");
  const { data: lessonSongs, error: lessonSongsError } = await supabase
    .from("lesson_songs")
    .select("song_id")
    .eq("lesson_id", slug);

  const assignedSongIds =
    lessonSongs?.map((ls: { song_id: string }) => ls.song_id) || [];

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Manage Songs for Lesson {slug}</h1>

      {(error || lessonSongsError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message ||
              lessonSongsError?.message ||
              "Failed to load data"}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <AddSongForm
          songs={songs}
          assignedSongIds={assignedSongIds}
          slug={slug}
        />
        <AssignedSongsList
          songs={songs}
          assignedSongIds={assignedSongIds}
          slug={slug}
        />
      </div>
    </div>
  );
}
