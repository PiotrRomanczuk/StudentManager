import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { 
  LessonInputSchema,
  LessonSchema,
  type LessonInput,
  type Lesson
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

    const { lessons, operation = "create" } = body;

    if (!Array.isArray(lessons) || lessons.length === 0) {
      return NextResponse.json({ error: "Lessons array is required and cannot be empty" }, { status: 400 });
    }

    if (lessons.length > 100) {
      return NextResponse.json({ error: "Cannot process more than 100 lessons at once" }, { status: 400 });
    }

    const results = {
      created: [] as Lesson[],
      errors: [] as any[],
      total: lessons.length,
      success: 0,
      failed: 0
    };

    // Validate all lessons first
    const validatedLessons: LessonInput[] = [];
    for (let i = 0; i < lessons.length; i++) {
      try {
        const validatedLesson = LessonInputSchema.parse(lessons[i]);
        validatedLessons.push(validatedLesson);
      } catch (validationError) {
        results.errors.push({
          index: i,
          error: "Validation failed",
          details: validationError
        });
        results.failed++;
      }
    }

    if (validatedLessons.length === 0) {
      return NextResponse.json(results, { status: 400 });
    }

    // Process validated lessons
    for (let i = 0; i < validatedLessons.length; i++) {
      try {
        const lessonData = validatedLessons[i];
        
        const { data: lesson, error } = await supabase
          .from("lessons")
          .insert({
            teacher_id: lessonData.teacher_id,
            student_id: lessonData.student_id,
            date: lessonData.date,
            time: lessonData.time,
            title: lessonData.title || null,
            notes: lessonData.notes || null,
            status: lessonData.status || "SCHEDULED",
            creator_user_id: user.id,
          })
          .select()
          .single();

        if (error) {
          results.errors.push({
            index: i,
            error: error.message,
            data: lessonData
          });
          results.failed++;
        } else {
          try {
            const validatedLesson = LessonSchema.parse(lesson);
            results.created.push(validatedLesson);
            results.success++;
          } catch (validationError) {
            results.errors.push({
              index: i,
              error: "Response validation failed",
              details: validationError
            });
            results.failed++;
          }
        }
      } catch (error) {
        results.errors.push({
          index: i,
          error: "Unexpected error",
          details: error
        });
        results.failed++;
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in bulk lesson creation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
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

    const { updates } = body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: "Updates array is required and cannot be empty" }, { status: 400 });
    }

    if (updates.length > 100) {
      return NextResponse.json({ error: "Cannot process more than 100 updates at once" }, { status: 400 });
    }

    const results = {
      updated: [] as Lesson[],
      errors: [] as any[],
      total: updates.length,
      success: 0,
      failed: 0
    };

    // Process updates
    for (let i = 0; i < updates.length; i++) {
      try {
        const { id, ...updateData } = updates[i];

        if (!id) {
          results.errors.push({
            index: i,
            error: "Lesson ID is required"
          });
          results.failed++;
          continue;
        }

        // Validate update data
        try {
          LessonInputSchema.partial().parse(updateData);
        } catch (validationError) {
          results.errors.push({
            index: i,
            error: "Validation failed",
            details: validationError
          });
          results.failed++;
          continue;
        }

        const { data: lesson, error } = await supabase
          .from("lessons")
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq("id", id)
          .select()
          .single();

        if (error) {
          results.errors.push({
            index: i,
            error: error.message,
            lessonId: id
          });
          results.failed++;
        } else {
          try {
            const validatedLesson = LessonSchema.parse(lesson);
            results.updated.push(validatedLesson);
            results.success++;
          } catch (validationError) {
            results.errors.push({
              index: i,
              error: "Response validation failed",
              details: validationError
            });
            results.failed++;
          }
        }
      } catch (error) {
        results.errors.push({
          index: i,
          error: "Unexpected error",
          details: error
        });
        results.failed++;
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in bulk lesson update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

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

    const { lessonIds } = body;

    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return NextResponse.json({ error: "Lesson IDs array is required and cannot be empty" }, { status: 400 });
    }

    if (lessonIds.length > 100) {
      return NextResponse.json({ error: "Cannot delete more than 100 lessons at once" }, { status: 400 });
    }

    const results = {
      deleted: [] as string[],
      errors: [] as any[],
      total: lessonIds.length,
      success: 0,
      failed: 0
    };

    // Process deletions
    for (let i = 0; i < lessonIds.length; i++) {
      try {
        const lessonId = lessonIds[i];

        if (!lessonId) {
          results.errors.push({
            index: i,
            error: "Lesson ID is required"
          });
          results.failed++;
          continue;
        }

        const { error } = await supabase
          .from("lessons")
          .delete()
          .eq("id", lessonId);

        if (error) {
          results.errors.push({
            index: i,
            error: error.message,
            lessonId
          });
          results.failed++;
        } else {
          results.deleted.push(lessonId);
          results.success++;
        }
      } catch (error) {
        results.errors.push({
          index: i,
          error: "Unexpected error",
          details: error
        });
        results.failed++;
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in bulk lesson deletion API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 