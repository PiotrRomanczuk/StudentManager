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
    const songIds = lessonSongs.map((song: { song_id: string }) => song.song_id);
    const res = await supabase.from("songs").select("*").in("id", songIds);
    songs = res.data;
    songsError = res.error;
  }

  if (songsError) throw new Error("Error fetching songs");
  if (!songs?.length) return { songs: [], lessonSongs: [] };

  // Sort songs by updated_at
  songs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

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