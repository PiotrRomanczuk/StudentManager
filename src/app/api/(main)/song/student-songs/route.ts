import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET(req: NextRequest) {
  console.log("[GET] /api/(main)/song/student-songs called with url:", req.url);
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  console.log("Extracted userId:", userId);

  if (!userId) {
    console.warn("No userId provided in query params");
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  console.log("Supabase client created");

  try {
    // 1. Get songs by user using the RPC function
    console.log("Calling supabase.rpc('get_songs_by_user') with:", { p_user_id: userId });
    const { data: userSongsID, error: rpcError } = await supabase.rpc("get_songs_by_user", {
      p_user_id: userId,
    });
    console.log("RPC result:", { userSongsID, rpcError });

    if (rpcError) {
      console.error("Error fetching student songs:", rpcError);
      return NextResponse.json(
        { error: "Error fetching student songs" },
        { status: 500 },
      );
    }

    if (!userSongsID || userSongsID.length === 0) {
      console.log("No songs found for user", userId);
      return NextResponse.json({ songs: [], total: 0 });
    }

    // 2. Get song details for the user's songs
    const songIds = userSongsID.map((song: { song_id: string }) => song.song_id);
    console.log("Fetching song details for IDs:", songIds);
    const { data: songs, error: songsError } = await supabase
      .from("songs")
      .select("*")
      .in("id", songIds);
    console.log("Songs fetch result:", { songs, songsError });

    if (songsError) {
      console.error("Error fetching songs details:", songsError);
      return NextResponse.json(
        { error: "Error fetching songs details" },
        { status: 500 },
      );
    }

    // 3. Create a map of song_id to status for quick lookup
    const statusMap = new Map(
      userSongsID.map((song: { song_id: string; song_status: string }) => [
        song.song_id, 
        song.song_status
      ])
    );
    console.log("Status map:", Array.from(statusMap.entries()));

    // 4. Merge songs with their status
    const songsWithStatus = songs.map((song: Record<string, unknown>) => ({
      ...song,
      status: statusMap.get((song as { id: string }).id) || "to learn"
    }));
    console.log("Final songsWithStatus:", songsWithStatus);

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