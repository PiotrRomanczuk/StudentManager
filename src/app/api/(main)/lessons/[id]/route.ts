import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { 
  LessonWithProfilesSchema, 
  LessonInputSchema,
  type LessonInput
} from "@/schemas";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: lesson, error } = await supabase
      .from("lessons")
      .select(`
        *,
        profile:profiles!lessons_student_id_fkey(email, firstName, lastName),
        teacher_profile:profiles!lessons_teacher_id_fkey(email, firstName, lastName)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching lesson:", error);
      // Check for PGRST116 error code (No rows returned)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Validate the lesson data
    try {
      const validatedLesson = LessonWithProfilesSchema.parse(lesson);
      return NextResponse.json(validatedLesson);
    } catch (validationError) {
      console.error("Lesson validation error:", validationError);
      return NextResponse.json({ error: "Invalid lesson data" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in lesson API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to update lessons
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate the update data
    let validatedData: Partial<LessonInput>;
    try {
      validatedData = LessonInputSchema.partial().parse(body);
    } catch (validationError) {
      console.error("Lesson update validation error:", validationError);
      return NextResponse.json(
        { error: "Invalid lesson update data", details: validationError },
        { status: 400 }
      );
    }

    const { data: lesson, error } = await supabase
      .from("lessons")
      .update({
        title: validatedData.title,
        notes: validatedData.notes,
        date: validatedData.date,
        time: validatedData.time,
        status: validatedData.status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating lesson:", error);
      // Check for PGRST116 error code (No rows returned)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Validate the updated lesson
    try {
      const validatedLesson = LessonWithProfilesSchema.parse(lesson);
      return NextResponse.json(validatedLesson);
    } catch (validationError) {
      console.error("Updated lesson validation error:", validationError);
      return NextResponse.json({ error: "Invalid lesson data" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in lesson update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to delete lessons
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase.from("lessons").delete().eq("id", id);

    if (error) {
      console.error("Error deleting lesson:", error);
      // Check for PGRST116 error code (No rows returned)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in lesson delete API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}