import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";
import { Song } from "@/types/Song";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currentUserId = searchParams.get("currentUserId");
  const targetUserId = searchParams.get("targetUserId");
  if (!currentUserId || !targetUserId) {
    return NextResponse.json(
      { error: "Missing currentUserId or targetUserId" },
      { status: 400 },
    );
  }
  const supabase = await createClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", currentUserId)
    .single();
  if (profileError) {
    return NextResponse.json(
      { error: "Error fetching user profile" },
      { status: 500 },
    );
  }
  if (!profile?.isAdmin) {
    return NextResponse.json(
      { error: "User is not an admin" },
      { status: 403 },
    );
  }
  const { data, error } = await supabase
    .from("user_favorites")
    .select("song:song_id(*)")
    .eq("user_id", targetUserId);
  if (error) {
    return NextResponse.json(
      { error: "Error fetching songs: " + error.message },
      { status: 500 },
    );
  }
  const songs = data?.map((fav: unknown) => (fav as { song: Song }).song) || [];
  return NextResponse.json(songs);
}
