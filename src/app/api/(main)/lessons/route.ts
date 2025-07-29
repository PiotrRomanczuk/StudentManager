import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { 
  LessonInputSchema, 
  LessonWithProfilesSchema, 
  LessonStatusEnum,
  type LessonInput,
  type LessonWithProfiles 
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

    const userId = searchParams.get("userId");
    const sort = searchParams.get("sort") || "created_at";
    const filter = searchParams.get("filter");
    const studentId = searchParams.get("studentId");

    let query = supabase
      .from("lessons")
      .select(`
        *,
        profile:profiles!lessons_student_id_fkey(email, firstName, lastName),
        teacher_profile:profiles!lessons_teacher_id_fkey(email, firstName, lastName)
      `);

    if (userId) {
      query = query.or(`student_id.eq.${userId},teacher_id.eq.${userId}`);
    }

    // Add student filter for admin users
    if (studentId) {
      // Validate that studentId is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(studentId)) {
        return NextResponse.json({ error: "Invalid student ID format" }, { status: 400 });
      }
      query = query.eq("student_id", studentId);
    }

    if (filter && filter !== "all") {
      // Validate the filter against the enum
      try {
        LessonStatusEnum.parse(filter.toUpperCase());
        query = query.eq("status", filter.toUpperCase());
      } catch {
        return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
      }
    }

    switch (sort) {
      case "date":
        query = query.order("date", { ascending: true });
        break;
      case "lesson_number":
        query = query.order("lesson_number", { ascending: true });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data: lessons, error } = await query;

    if (error) {
      console.error("Error fetching lessons:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Validate the response data with more flexible handling
    const validatedLessons: LessonWithProfiles[] = [];
    for (const lesson of lessons || []) {
      try {
        // Pre-process the lesson data to handle null values and missing fields
        const processedLesson = {
          ...lesson,
          // Handle null values for optional fields
          title: lesson.title || undefined,
          notes: lesson.notes || undefined,
          date: lesson.date || undefined,
          lesson_teacher_number: lesson.lesson_teacher_number || undefined,
          // Ensure datetime strings are properly formatted
          created_at: lesson.created_at ? new Date(lesson.created_at).toISOString() : undefined,
          updated_at: lesson.updated_at ? new Date(lesson.updated_at).toISOString() : undefined,
          // Handle profile objects with missing user_id or null profiles
          profile: lesson.profile && Object.keys(lesson.profile).length > 0 ? {
            ...lesson.profile,
            user_id: lesson.profile.user_id || lesson.profile.id || undefined,
          } : null,
          teacher_profile: lesson.teacher_profile && Object.keys(lesson.teacher_profile).length > 0 ? {
            ...lesson.teacher_profile,
            user_id: lesson.teacher_profile.user_id || lesson.teacher_profile.id || undefined,
          } : null,
        };

        const validatedLesson = LessonWithProfilesSchema.parse(processedLesson);
        validatedLessons.push(validatedLesson);
      } catch (validationError) {
        console.error("Lesson validation error:", validationError);
        // Continue with other lessons even if one fails validation
        // Add the lesson with basic validation to prevent complete failure
        if (lesson.id && lesson.student_id && lesson.teacher_id) {
          // Create a minimal valid lesson object
          const fallbackLesson: LessonWithProfiles = {
            id: lesson.id,
            student_id: lesson.student_id,
            teacher_id: lesson.teacher_id,
            lesson_number: lesson.lesson_number || undefined,
            title: lesson.title || undefined,
            notes: lesson.notes || undefined,
            date: lesson.date || undefined,
            time: lesson.time || undefined,
            status: lesson.status || "SCHEDULED",
            created_at: lesson.created_at ? new Date(lesson.created_at).toISOString() : undefined,
            updated_at: lesson.updated_at ? new Date(lesson.updated_at).toISOString() : undefined,
            profile: lesson.profile || null,
            teacher_profile: lesson.teacher_profile || null,
          };
          validatedLessons.push(fallbackLesson);
        }
      }
    }

    return NextResponse.json({ lessons: validatedLessons });
  } catch (error) {
    console.error("Error in lessons API:", error);
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

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error in lesson creation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}