import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("user_id", user.id)
      .single();

    if (!profile || !profile.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get total songs count
    const { count: totalSongs } = await supabase
      .from("songs")
      .select("*", { count: "exact", head: true });

    // Get songs by level
    const { data: songsByLevel } = await supabase
      .from("songs")
      .select("level")
      .not("level", "is", null);

    const levelStats = songsByLevel?.reduce((acc: Record<string, number>, song: { level: string }) => {
      acc[song.level] = (acc[song.level] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get songs by key
    const { data: songsByKey } = await supabase
      .from("songs")
      .select("key")
      .not("key", "is", null);

    const keyStats = songsByKey?.reduce((acc: Record<string, number>, song: { key: string }) => {
      acc[song.key] = (acc[song.key] || 0) + 1;
      return acc;
    }, {}) || {};

    // Get songs with audio files
    const { count: songsWithAudio } = await supabase
      .from("songs")
      .select("*", { count: "exact", head: true })
      .not("audio_files", "is", null);

    // Get songs with chords
    const { count: songsWithChords } = await supabase
      .from("songs")
      .select("*", { count: "exact", head: true })
      .not("chords", "is", null);

    // Get top authors
    const { data: topAuthors } = await supabase
      .from("songs")
      .select("author")
      .not("author", "is", null);

    const authorStats = topAuthors?.reduce((acc: Record<string, number>, song: { author: string }) => {
      acc[song.author] = (acc[song.author] || 0) + 1;
      return acc;
    }, {}) || {};

    const topAuthorsList = Object.entries(authorStats)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([author, count]) => ({ author, count }));

    // Calculate average songs per author
    const uniqueAuthors = Object.keys(authorStats).length;
    const averageSongsPerAuthor = uniqueAuthors > 0 ? totalSongs / uniqueAuthors : 0;

    // Get recent songs (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: recentSongs } = await supabase
      .from("songs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString());

    return NextResponse.json({
      total_songs: totalSongs || 0,
      songs_by_level: levelStats,
      songs_by_key: keyStats,
      songs_with_audio: songsWithAudio || 0,
      songs_with_chords: songsWithChords || 0,
      top_authors: topAuthorsList,
      average_songs_per_author: Math.round(averageSongsPerAuthor * 100) / 100,
      recent_songs: recentSongs || 0,
      songs_without_audio: (totalSongs || 0) - (songsWithAudio || 0),
      songs_without_chords: (totalSongs || 0) - (songsWithChords || 0),
    });
  } catch (error) {
    console.error("Error in song stats API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 