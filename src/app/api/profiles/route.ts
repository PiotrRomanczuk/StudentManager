import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";
import { getUserAndAdmin } from "@/app/dashboard/@utils/getUserAndAdmin";

export async function GET() {
  const supabase = await createClient();
  try {
    const { user, isAdmin } = await getUserAndAdmin(supabase);
    if (isAdmin) {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*");
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ profiles });
    } else {
      // Get the user's own profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (profileError) {
        return NextResponse.json(
          { error: profileError.message },
          { status: 500 },
        );
      }
      // Get the user's songs (reuse logic from user-songs route)
      // 1. Find lessons where user is student or teacher
      const { data: lessons, error: lessonsError } = await supabase
        .from("lessons")
        .select("id")
        .or(`student_id.eq.${user.id},teacher_id.eq.${user.id}`);
      if (lessonsError) {
        return NextResponse.json(
          { error: "Error fetching lessons" },
          { status: 500 },
        );
      }
      if (!lessons || lessons.length === 0) {
        return NextResponse.json({ profile, songs: [] });
      }
      const lessonIds = lessons.map((lesson: { id: string }) => lesson.id);
      // 2. Get lesson_songs for those lessons
      const { data: lessonSongs, error: lessonSongsError } = await supabase
        .from("lesson_songs")
        .select("song_id, song_status")
        .in("lesson_id", lessonIds);
      if (lessonSongsError) {
        return NextResponse.json(
          { error: "Error fetching lesson songs" },
          { status: 500 },
        );
      }
      if (!lessonSongs || lessonSongs.length === 0) {
        return NextResponse.json({ profile, songs: [] });
      }
      const songIdToStatus = lessonSongs.reduce(
        (
          acc: Record<string, string>,
          ls: { song_id: string; song_status: string },
        ) => {
          acc[ls.song_id] = ls.song_status;
          return acc;
        },
        {},
      );
      const songIds = lessonSongs.map((ls: { song_id: string }) => ls.song_id);
      // 3. Get song details
      const { data: songs, error: songsError } = await supabase
        .from("songs")
        .select("*")
        .in("id", songIds);
      if (songsError) {
        return NextResponse.json(
          { error: "Error fetching user songs" },
          { status: 500 },
        );
      }
      // Combine song details with their status as a property on each song
      const songsWithStatus = songs.map((song: Record<string, unknown>) => ({
        ...song,
        status: songIdToStatus[(song as { id: string }).id] || null,
      }));
      return NextResponse.json({ profile, songs: songsWithStatus });
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
