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

type Lesson = {
  id: string;
  student_id: string;
};

type Profile = {
  user_id: string;
  email: string;
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
        student_id
      `)
      .in("id", lessonSongs.map((ls: LessonSong) => ls.lesson_id));

    if (lessonsError) {
      throw new Error(`Failed to fetch lessons: ${lessonsError.message}`);
    }

    // Get the student profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, email")
      .in("user_id", lessons?.map((lesson: Lesson) => lesson.student_id) || []);

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    // Create a map of student_id to email
    const studentToEmail = new Map(
      (profiles || []).map((profile: Profile) => [profile.user_id, profile.email])
    );

    // Create a map of lesson_id to student email
    const lessonToEmail = new Map(
      (lessons || []).map((lesson: Lesson) => [lesson.id, studentToEmail.get(lesson.student_id)])
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
