import { Lesson } from "@/types/Lesson";

export async function fetchSongs(supabase: any, userId: string, isAdmin: boolean) {
    if (isAdmin) {
      const { data, error } = await supabase.from("songs").select("*");
      if (error) throw new Error("Error fetching songs");
      return data;
    }
  
    // Get user's lessons and associated songs
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("*")
      .eq("student_id", userId);
    if (lessonsError) throw new Error("Error fetching lessons");
    if (!lessons?.length) return [];
  
    const { data: lessonSongs, error: lessonSongsError } = await supabase
      .from("lesson_songs")
      .select("*")
      .in("lesson_id", lessons.map((lesson: Lesson) => lesson.id));
    if (lessonSongsError) throw new Error("Error fetching lesson songs");
    if (!lessonSongs?.length) return [];
  
    const { data: songs, error: songsError } = await supabase
      .from("songs")
      .select("*")
      .in("id", lessonSongs.map((song: any) => song.song_id));
    if (songsError) throw new Error("Error fetching songs");
    return songs;
  }