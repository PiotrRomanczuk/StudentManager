import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Song } from "@/types/Song";
import { Badge } from "@/components/ui/badge";
import { Music } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/clients/server";

export default async function SongInformation({
  lesson,
}: {
  lesson: { songs: Song[]; id: string };
}) {
  const supabase = await createClient();
  const { data: lessonSongs, error: lessonSongsError } = await supabase
    .from("lesson_songs")
    .select("*")
    .eq("lesson_id", lesson.id);

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*")
    .in("id", lessonSongs.map((lessonSong) => lessonSong.song_id));

  if (lessonSongsError || songsError) {
    console.error("Failed to load songs:", lessonSongsError || songsError);
    return (
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Songs</CardTitle>
            <Badge variant="outline" className="ml-2">
              0
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <p className="text-red-500">Failed to load songs. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const songMap = new Map(songs.map((song: Song) => [song.id, song]));

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Songs</CardTitle>
          <Badge variant="outline" className="ml-2">
            {lessonSongs.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {lessonSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Music className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No songs added to this lesson yet.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {lessonSongs.map((lessonSong: { song_id: string }, index: number) => {
              const song = songMap.get(lessonSong.song_id);
              return (
                <li key={`${lessonSong.song_id}-${index}`} className="rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" />
                    <span className="font-medium">{song?.title || "No Title"}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/dashboard/lessons/${lesson.id}/manage-songs`}>
            Manage Songs
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
