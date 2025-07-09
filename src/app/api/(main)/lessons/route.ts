import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";

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

    if (filter && filter !== "all") {
      query = query.eq("status", filter.toUpperCase());
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

    return NextResponse.json({ lessons });
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

    // Check for required fields
    const { teacherId, studentId, date, time } = body;
    if (!teacherId || !studentId || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: lesson, error } = await supabase
      .from("lessons")
      .insert({
        teacher_id: teacherId,
        student_id: studentId,
        date,
        time,
        title: body.title || null,
        notes: body.notes || null,
        status: body.status || "SCHEDULED",
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