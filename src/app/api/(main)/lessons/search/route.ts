import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { 
  LessonStatusEnum,
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

    const query = searchParams.get("q") || "";
    const status = searchParams.get("status");
    const studentId = searchParams.get("studentId");
    const teacherId = searchParams.get("teacherId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let supabaseQuery = supabase
      .from("lessons")
      .select(`
        *,
        profile:profiles!lessons_student_id_fkey(email, firstName, lastName),
        teacher_profile:profiles!lessons_teacher_id_fkey(email, firstName, lastName)
      `);

    // Apply filters
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,notes.ilike.%${query}%`
      );
    }

    if (status) {
      try {
        LessonStatusEnum.parse(status.toUpperCase());
        supabaseQuery = supabaseQuery.eq("status", status.toUpperCase());
      } catch {
        return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
      }
    }

    if (studentId) {
      supabaseQuery = supabaseQuery.eq("student_id", studentId);
    }

    if (teacherId) {
      supabaseQuery = supabaseQuery.eq("teacher_id", teacherId);
    }

    if (dateFrom) {
      supabaseQuery = supabaseQuery.gte("date", dateFrom);
    }

    if (dateTo) {
      supabaseQuery = supabaseQuery.lte("date", dateTo);
    }

    // Apply sorting
    const validSortFields = ["title", "date", "created_at", "updated_at", "lesson_number"];
    const validSortOrders = ["asc", "desc"];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
      supabaseQuery = supabaseQuery.order(sortBy, { ascending: sortOrder === "asc" });
    } else {
      supabaseQuery = supabaseQuery.order("created_at", { ascending: false });
    }

    // Apply pagination
    supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

    const { data: lessons, error, count } = await supabaseQuery;

    if (error) {
      console.error("Error searching lessons:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Validate the response data
    const validatedLessons: LessonWithProfiles[] = [];
    for (const lesson of lessons || []) {
      try {
        // Basic validation - we'll use a simplified schema for search results
        if (lesson.id && lesson.student_id && lesson.teacher_id) {
          validatedLessons.push(lesson as LessonWithProfiles);
        }
      } catch (validationError) {
        console.error("Lesson validation error:", validationError);
        // Continue with other lessons even if one fails validation
      }
    }

    return NextResponse.json({
      lessons: validatedLessons,
      total: count || validatedLessons.length,
      limit,
      offset,
      hasMore: validatedLessons.length === limit
    });
  } catch (error) {
    console.error("Error in lesson search API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 