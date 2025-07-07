import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";

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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.role !== "admin" && profile.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { teacherId, studentId, date, time, title, notes, status } = body;

    if (!teacherId || !studentId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call the increment_lesson_number function to get the next lesson number
    const { data: lessonNumberData, error: lessonNumberError } =
      await supabase.rpc("increment_lesson_number", {
        p_student_id: studentId,
        p_teacher_id: teacherId,
      });

    if (lessonNumberError) {
      console.error("Error fetching lesson number:", lessonNumberError);
      return NextResponse.json(
        { error: "Error fetching lesson number" },
        { status: 500 }
      );
    }

    const lessonNumber = lessonNumberData;

    const { data: lesson, error } = await supabase
      .from("lessons")
      .insert({
        teacher_id: teacherId,
        student_id: studentId,
        date: date,
        time: time,
        creator_user_id: user.id,
        lesson_number: lessonNumber,
        title: title || null,
        notes: notes || null,
        status: status || "SCHEDULED",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating lesson:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error in lesson create API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}