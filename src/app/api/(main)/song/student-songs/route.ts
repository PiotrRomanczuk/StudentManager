import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  try {
    // 1. Get songs by student using the RPC function
    const { data: studentSongsID, error: rpcError } = await supabase.rpc("get_songs_by_student", {
      p_student_id: studentId,
    });

    if (rpcError) {
      console.error("Error fetching student songs:", rpcError);
      return NextResponse.json(
        { error: "Error fetching student songs" },
        { status: 500 },
      );
    }

    if (!studentSongsID || studentSongsID.length === 0) {
      return NextResponse.json({ songs: [], total: 0 });
    }

    // 2. Get song details for the student's songs
    const { data: songs, error: songsError } = await supabase
      .from("songs")
      .select("*")
      .in("id", studentSongsID.map((song: { song_id: string }) => song.song_id));

    if (songsError) {
      console.error("Error fetching songs details:", songsError);
      return NextResponse.json(
        { error: "Error fetching songs details" },
        { status: 500 },
      );
    }

    // 3. Create a map of song_id to status for quick lookup
    const statusMap = new Map(
      studentSongsID.map((song: { song_id: string; song_status: string }) => [
        song.song_id, 
        song.song_status
      ])
    );

    // 4. Merge songs with their status
    const songsWithStatus = songs.map((song: Record<string, unknown>) => ({
      ...song,
      status: statusMap.get((song as { id: string }).id) || "to learn"
    }));

    return NextResponse.json({ 
      songs: songsWithStatus, 
      total: songsWithStatus.length 
    });

  } catch (error) {
    console.error("Unexpected error while fetching student songs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
} 