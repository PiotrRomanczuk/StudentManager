import { createClient } from "@/utils/supabase/clients/server";
import { Lesson } from "@/types/Lesson";
import { Song } from "@/types/Song";

export async function fetchUserSongs(userId: string, targetUserId?: string) {
  const supabase = await createClient();

  // Fetch user role
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", userId)
    .single();

  if (profileError) throw new Error("Error checking permissions");

  const isAdmin = userProfile?.isAdmin;

  // Fetch lessons where user is either student or teacher
  const query = supabase
    .from("lessons")
    .select("*")
    .or(`student_id.eq.${userId},teacher_id.eq.${userId}`);

  if (targetUserId) {
    query.or(`student_id.eq.${targetUserId},teacher_id.eq.${targetUserId}`);
  }

  const { data: lessons, error: lessonsError } = await query;

  if (lessonsError) throw new Error("Error fetching lessons");
  if (!lessons?.length) return { songs: [], lessonSongs: [] };

  const lessonIds = lessons.map((lesson: Lesson) => lesson.id);

  // Fetch lesson songs
  const { data: lessonSongs, error: lessonSongsError } = await supabase
    .from("lesson_songs")
    .select("*")
    .in("lesson_id", lessonIds);

  if (lessonSongsError) throw new Error("Error fetching lesson songs");
  if (!lessonSongs?.length) return { songs: [], lessonSongs: [] };

  // Fetch songs
  let songs: Song[] | null = [];
  let songsError;

  if (isAdmin) {
    const res = await supabase.from("songs").select("*");
    songs = res.data;
    songsError = res.error;
  } else {
    const songIds = lessonSongs.map(
      (song: { song_id: string }) => song.song_id,
    );
    const res = await supabase.from("songs").select("*").in("id", songIds);
    songs = res.data;
    songsError = res.error;
  }

  if (songsError) throw new Error("Error fetching songs");
  if (!songs?.length) return { songs: [], lessonSongs: [] };

  // Sort songs by updated_at
  songs.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  return { songs, lessonSongs };
}

export async function fetchAllProfiles() {
  const supabase = await createClient();
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*");

  if (profilesError) throw new Error("Error fetching profiles");
  return profiles;
}

export async function fetchAdminUserFavoriteSongs(userId: string) {
  const supabase = await createClient();

  // Check if the user is an admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", userId)
    .single();

  if (profileError) {
    throw new Error("Error fetching user profile");
  }
  if (!profile?.isAdmin) {
    throw new Error("User is not an admin");
  }

  // Fetch songs favorited by this user (using relationships)
  const { data, error } = await supabase
    .from("user_favorites")
    .select("song:song_id(*), profiles!inner(isAdmin, user_id)")
    .eq("user_id", userId)
    .eq("profiles.isAdmin", true);

  if (error) {
    throw new Error("Error fetching songs: " + error.message);
  }

  // Return only the songs
  const songs = data?.map((fav: unknown) => (fav as { song: Song }).song) || [];
  return songs;
}

export async function fetchUserFavoriteSongsAsAdmin(currentUserId: string, targetUserId: string) {
  const supabase = await createClient();

  // Check if the current user is an admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", currentUserId)
    .single();

  if (profileError) {
    throw new Error("Error fetching user profile");
  }
  if (!profile?.isAdmin) {
    throw new Error("User is not an admin");
  }

  // Fetch songs favorited by the target user
  const { data, error } = await supabase
    .from("user_favorites")
    .select("song:song_id(*)")
    .eq("user_id", targetUserId);

  if (error) {
    throw new Error("Error fetching songs: " + error.message);
  }

  const songs = data?.map((fav: unknown) => (fav as { song: Song }).song) || [];
  return songs;
}
