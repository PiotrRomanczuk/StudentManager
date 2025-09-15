import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const songId = searchParams.get("songId");

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user for authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or teacher
    const { data: profile } = await supabase
      .from("profiles")
      .select("isAdmin, isTeacher")
      .eq("user_id", user.id)
      .single();

    if (!profile || (!profile.isAdmin && !profile.isTeacher)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get students who have this song assigned
    const { data: lessonSongs, error } = await supabase
      .from("lesson_songs")
      .select(`
        song_id,
        song_status,
        lesson:lessons(
          id,
          title,
          date,
          status,
          student_id,
          student:profiles!lessons_student_id_fkey(
            user_id,
            email,
            firstName,
            lastName
          )
        )
      `)
      .eq("song_id", songId);

    if (error) {
      console.error("Error fetching students by song:", error);
      return NextResponse.json(
        { error: "Error fetching students by song" },
        { status: 500 }
      );
    }

    if (!lessonSongs || lessonSongs.length === 0) {
      return NextResponse.json({ 
        students: [], 
        total: 0 
      });
    }

    // Group by student to avoid duplicates and get unique students
    const studentMap = new Map();
    
    lessonSongs.forEach((ls: { 
      song_status: string; 
      lesson?: { 
        id: string; 
        title: string; 
        date: string; 
        status: string; 
        student_id: string; 
        student?: { 
          user_id: string; 
          email: string; 
          firstName: string; 
          lastName: string; 
        }; 
      }; 
    }) => {
      if (!ls.lesson || !ls.lesson.student) return;
      
      const studentId = ls.lesson.student_id;
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          student_id: studentId,
          song_status: ls.song_status,
          student: ls.lesson.student,
          lessons: []
        });
      }
      
      // Add lesson info
      if (ls.lesson) {
        studentMap.get(studentId).lessons.push({
          lesson_id: ls.lesson.id,
          title: ls.lesson.title,
          date: ls.lesson.date,
          status: ls.lesson.status
        });
      }
    });

    const students = Array.from(studentMap.values());

    return NextResponse.json({ 
      students,
      total: students.length 
    });

  } catch (error) {
    console.error("Unexpected error while fetching students by song:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 