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
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("isAdmin, isTeacher")
      .eq("user_id", user.id)
      .single();

    console.log("User ID:", user.id);
    console.log("Profile fetch error:", profileError);
    console.log("Fetched profile:", profile);

    if (!profile || (!profile.isAdmin && !profile.isTeacher)) {
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
        title: validatedData.title || null,
        notes: validatedData.notes || null,
        status: validatedData.status || "SCHEDULED",
        creator_user_id: user.id,
      })
      .select()
      .single();

    // ...existing code...
    if (error) {
      console.error("Error creating lesson:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Inserted lesson:", lesson); // <-- Add this line

    // Validate the created lesson
    try {
      const validatedLesson = LessonSchema.parse(lesson);
      return NextResponse.json(validatedLesson);
    } catch (validationError) {
      console.error("Created lesson validation error:", validationError);
      return NextResponse.json({ error: "Invalid lesson data" }, { status: 500 });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}