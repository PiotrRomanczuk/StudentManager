import { createClient } from "@/utils/supabase/clients/server";

type SongStatus = "to_learn" | "started" | "remembered" | "with_author" | "mastered";

export type LessonSong = {
  lesson_id: string;
  song_id: string;
  created_at: Date;
  updated_at: Date;
  song_status: SongStatus;
  student_id: string;
  student_email?: string;
};

type LessonWithStudent = {
  id: string;
  student?: {
    email: string;
  };
};

export async function fetchLessonsSong(songId: string): Promise<{
  data: LessonSong[] | null;
  error: Error | null;
}> {
  try {
    const supabase = await createClient();
    
    // First get the lesson songs
    const { data: lessonSongs, error: lessonSongsError } = await supabase
      .from("lesson_songs")
      .select(`
        lesson_id,
        song_id,
        created_at,
        updated_at,
        student_id,
        song_status
      `)
      .eq("song_id", songId)
      .order("created_at", { ascending: false });

    if (lessonSongsError) {
      throw new Error(`Failed to fetch lesson songs: ${lessonSongsError.message}`);
    }

    if (!lessonSongs || lessonSongs.length === 0) {
      return { data: [], error: null };
    }

    // Then get the student emails for these lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select(`
        id,
        student:profiles (
          email
        )
      `)
      .in("id", lessonSongs.map((ls: LessonSong) => ls.lesson_id));

    if (lessonsError) {
      throw new Error(`Failed to fetch lessons: ${lessonsError.message}`);
    }

    // Create a map of lesson_id to student email
    const lessonToEmail = new Map(
      (lessons as LessonWithStudent[] || []).map(lesson => [lesson.id, lesson.student?.email])
    );

    // Combine the data
    const transformedData = lessonSongs.map((lessonSong: LessonSong) => ({
      ...lessonSong,
      student_email: lessonToEmail.get(lessonSong.lesson_id)
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error("Error in fetchLessonsSong:", error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error("An unknown error occurred") 
    };
  }
}
