import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");



  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // 1. Get all lesson IDs for this user (as student)
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id")
    .eq("student_id", userId);
  if (lessonsError) {
    return NextResponse.json(
      { error: "Error fetching lessons" },
      { status: 500 },
    );
  }


  const lessonIds = lessons?.map((l: { id: string }) => l.id);
  if (!lessonIds || lessonIds.length === 0) {
    return NextResponse.json([]); // No lessons, so no songs
  }

  // 2. Get all song IDs and their status from lesson_songs for these lessons
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
  const songIdToStatus = new Map<string, string>();
  const songIds = lessonSongs?.map(
    (ls: { song_id: string; song_status: string }) => {
      songIdToStatus.set(ls.song_id, ls.song_status);
      return ls.song_id;
    },
  );
  if (!songIds || songIds.length === 0) {
    return NextResponse.json([]); // No songs for these lessons
  }

  // 3. Get all songs from songs table for these song IDs
  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*")
    .in("id", songIds);
  if (songsError) {
    return NextResponse.json(
      { error: "Error fetching songs" },
      { status: 500 },
    );
  }

  // 4. Attach song_status to each song
  const songsWithStatus = songs.map((song: unknown) => {
    if (typeof song === "object" && song !== null && "id" in song) {
      return {
        ...(song as { [key: string]: unknown }),
        song_status: songIdToStatus.get((song as { id: string }).id) || null,
      };
    }
    return song;
  });

  return NextResponse.json(songsWithStatus);
}
