import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";
import { fetchUserSongs, fetchUserFavoriteSongsAsAdmin, fetchAllProfiles } from "@/app/services/songService";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  console.log("user", user);
  if (userError || !user?.user) {
    return NextResponse.json({ error: "Authentication error" }, { status: 401 });
  }
  const userId = user.user.id;

  console.log("userId", userId);

  // Fetch user role
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", userId)
    .single();

  console.log("userProfile", userProfile);
  if (profileError) {
    return NextResponse.json({ error: "Error checking permissions" }, { status: 403 });
  }
  const isAdmin = userProfile?.isAdmin;

  console.log("isAdmin", isAdmin);

  // Get user_id from query params
  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get("user_id");

  try {
    let songs;
    if (isAdmin && targetUserId) {
      // Admin fetching another user's favorite songs
      songs = await fetchUserFavoriteSongsAsAdmin(userId, targetUserId);
    } else if (isAdmin) {
      // Admin fetching all songs
      const { data, error } = await supabase.from("songs").select("*");
      if (error) {
        return NextResponse.json({ error: "Error fetching songs" }, { status: 500 });
      }
      songs = data;
    } else {
      // Regular user fetching their own songs
      const result = await fetchUserSongs(userId);
      songs = result.songs;
    }
    const profiles = await fetchAllProfiles();
    return NextResponse.json({ songs, profiles });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
} 