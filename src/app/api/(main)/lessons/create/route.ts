import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { 
  LessonInputSchema, 
  LessonSchema,
  type LessonInput
} from "@/schemas";

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

    // Check if user has permission to create lessons
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate input data using the schema
    let validatedData: LessonInput;
    try {
      validatedData = LessonInputSchema.parse(body);
    } catch (validationError) {
      console.error("Lesson input validation error:", validationError);
      return NextResponse.json(
        { error: "Invalid lesson data", details: validationError },
        { status: 400 }
      );
    }

    const { data: lesson, error } = await supabase
      .from("lessons")
      .insert({
        teacher_id: validatedData.teacher_id,
        student_id: validatedData.student_id,
        date: validatedData.date,
        time: validatedData.time,
        title: validatedData.title || null,
        notes: validatedData.notes || null,
        status: validatedData.status || "SCHEDULED",
        creator_user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating lesson:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Validate the created lesson
    try {
      const validatedLesson = LessonSchema.parse(lesson);
      return NextResponse.json(validatedLesson);
    } catch (validationError) {
      console.error("Created lesson validation error:", validationError);
      return NextResponse.json({ error: "Invalid lesson data" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in lesson creation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}