// import { useState } from 'react';
import { Container } from "@/components/ui/container";
import { ShortSongTable } from "./@components/cards/ShortSongTable";
import { createClient } from "@/utils/supabase/clients/server";
import { ErrorComponent } from "./songs/@components/ErrorComponent";
import NoSongsFound from "./songs/@components/NoSongsFound";
import { Lesson } from "@/types/Lesson";

export default async function Page() {
  const supabase = await createClient();

  // Get user
  const { data: user, error: userIdError } = await supabase.auth.getUser();
  if (userIdError) {
    return <ErrorComponent error="Authentication error" />;
  }

  const { data: userIsAdmin, error: userIsAdminError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", user.user.id)
    .single();

  if (userIsAdminError) {
    return <ErrorComponent error="Error checking permissions" />;
  }

  // Get lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .eq("student_id", user.user.id);

  if (lessonsError) {
    return <ErrorComponent error="Error fetching lessons" />;
  }

  if (!lessons?.length) {
    return <NoSongsFound />;
  }

  // Get lesson songs
  const { data: lessonSongs, error: lessonSongsError } = await supabase
    .from("lesson_songs")
    .select("*")
    .in(
      "lesson_id",
      lessons.map((lesson: Lesson) => lesson.id),
    );

  if (lessonSongsError) {
    return <ErrorComponent error="Error fetching lesson songs" />;
  }

  if (!lessonSongs?.length) {
    return <NoSongsFound />;
  }

  // Fix the songs fetching logic
  let songs;
  let songsError;

    if (!userIsAdmin?.isAdmin) {
    const response = await supabase
    .from("songs")
    .select("*")
    .in(
      "id",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lessonSongs.map((song: any) => song.song_id),
      );
      songs = response.data;
      songsError = response.error;
    } else {
    const response = await supabase.from("songs").select("*");
    songs = response.data;
    songsError = response.error;
  }

  if (songsError) {
    return <ErrorComponent error="Error fetching songs" />;
  }

  if (!songs?.length) {
    return <NoSongsFound />;
  }

  if (songs.length === 0) {
    return <div>No songs found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="max-w-4xl py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Songs</h2>
          <ShortSongTable songs={songs} />
        </div>
      </Container>
    </div>
  );
}
