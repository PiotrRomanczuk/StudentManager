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
    .in(
      "id",
      lessonSongs.map((lessonSong: { song_id: string }) => lessonSong.song_id),
    );

  if (lessonSongsError || songsError) {
    console.error("Failed to load songs:", lessonSongsError || songsError);
    return (
      <Card className="flex-1 border-lesson-blue-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-lesson-blue-text">Songs</CardTitle>
            <Badge variant="outline" className="ml-2 border-lesson-blue-border text-lesson-blue-text">
              0
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <p className="text-red-500">
              Failed to load songs. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const songMap = new Map<string, Song>(
    songs.map((song: Song) => [song.id, song]),
  );

  return (
    <Card className="flex-1 border-lesson-blue-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-lesson-blue-text">Songs</CardTitle>
          <Badge variant="outline" className="ml-2 border-lesson-blue-border text-lesson-blue-text">
            {lessonSongs.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {lessonSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Music className="mb-2 h-8 w-8 text-lesson-blue-text" />
            <p className="text-sm text-lesson-blue-text">
              No songs added to this lesson yet.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {lessonSongs.map(
              (lessonSong: { song_id: string }, index: number) => {
                const song = songMap.get(lessonSong.song_id);
                return (
                  <li
                    key={`${lessonSong.song_id}-${index}`}
                    className="rounded-md border border-lesson-blue-border p-3 hover:bg-lesson-blue-bg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-lesson-blue-text" />
                      <span className="font-medium">
                        {song?.title || "No Title"}
                      </span>
                      <Link
                        href={`/dashboard/songs/${lessonSong.song_id}`}
                        className="ml-auto"
                      >
                        <Button variant="link" className="text-lesson-blue-text hover:text-lesson-blue-text/80">
                          View Song
                        </Button>
                      </Link>
                    </div>
                  </li>
                );
              },
            )}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full border-lesson-blue-border hover:bg-lesson-blue-bg hover:text-lesson-blue-text">
          <Link href={`/dashboard/lessons/${lesson.id}/manage-songs`}>
            Manage Songs
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
