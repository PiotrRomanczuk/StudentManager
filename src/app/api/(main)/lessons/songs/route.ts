import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { 
  LessonSongSchema,
  SongStatusEnum,
  type LessonSong
} from "@/schemas";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lessonId = searchParams.get("lessonId");
    const songId = searchParams.get("songId");
    const studentId = searchParams.get("studentId");

    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });
    }

    let query = supabase
      .from("lesson_songs")
      .select(`
        *,
        song:songs(title, author, level, key),
        lesson:lessons(title, date, status)
      `)
      .eq("lesson_id", lessonId);

    if (songId) {
      query = query.eq("song_id", songId);
    }

    if (studentId) {
      query = query.eq("student_id", studentId);
    }

    const { data: lessonSongs, error } = await query;

    if (error) {
      console.error("Error fetching lesson songs:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lessonSongs: lessonSongs || [] });
  } catch (error) {
    console.error("Error in lesson songs API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to assign songs to lessons
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate input data
    let validatedData: LessonSong;
    try {
      validatedData = LessonSongSchema.parse(body);
    } catch (validationError) {
      console.error("Lesson song input validation error:", validationError);
      return NextResponse.json(
        { error: "Invalid lesson song data", details: validationError },
        { status: 400 }
      );
    }

    // Check if the lesson exists
    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("id")
      .eq("id", validatedData.lesson_id)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if the song exists
    const { data: song, error: songError } = await supabase
      .from("songs")
      .select("id")
      .eq("id", validatedData.song_id)
      .single();

    if (songError || !song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Check if this song is already assigned to this lesson
    const { data: existingAssignment } = await supabase
      .from("lesson_songs")
      .select("id")
      .eq("lesson_id", validatedData.lesson_id)
      .eq("song_id", validatedData.song_id)
      .single();

    if (existingAssignment) {
      return NextResponse.json({ error: "Song is already assigned to this lesson" }, { status: 409 });
    }

    const { data: lessonSong, error } = await supabase
      .from("lesson_songs")
      .insert({
        lesson_id: validatedData.lesson_id,
        song_id: validatedData.song_id,
        song_status: validatedData.song_status || "started",
        student_id: validatedData.student_id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error assigning song to lesson:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(lessonSong);
  } catch (error) {
    console.error("Error in lesson song assignment API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 