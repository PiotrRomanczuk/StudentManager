import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const supabase = await createClient();

  if (userId) {
    // 1. Find lessons where user is student or teacher
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("id")
      .or(`student_id.eq.${userId},teacher_id.eq.${userId}`);
    if (lessonsError) {
      return NextResponse.json(
        { error: "Error fetching lessons" },
        { status: 500 },
      );
    }
    if (!lessons || lessons.length === 0) {
      return NextResponse.json({ 
        songs: [], 
        pagination: {
          page: 1,
          limit: 50,
          total: 0,
          totalPages: 0
        }
      });
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
      return NextResponse.json({ 
        songs: [], 
        pagination: {
          page: 1,
          limit: 50,
          total: 0,
          totalPages: 0
        }
      });
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

    // 3. Get all songs without pagination
    const {
      data: songs,
      error: songsError,
      count,
    } = await supabase
      .from("songs")
      .select("*", { count: "exact" })
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
    
    const totalPages = Math.ceil((count || 0) / 50);
    return NextResponse.json({ 
      songs: songsWithStatus, 
      pagination: {
        page: 1,
        limit: 50,
        total: count || 0,
        totalPages
      }
    });
  } else {
    const {
      data: allSongs,
      error,
      count,
    } = await supabase.from("songs").select("*", { count: "exact" });
    if (error) {
      return NextResponse.json(
        { error: "Error fetching songs" },
        { status: 500 },
      );
    }
    
    const totalPages = Math.ceil((count || 0) / 50);
    return NextResponse.json({ 
      songs: allSongs, 
      pagination: {
        page: 1,
        limit: 50,
        total: count || 0,
        totalPages
      }
    });
  }
}
