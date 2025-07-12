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

    const teacherId = searchParams.get("teacherId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (!teacherId) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    // Get teacher availability
    let availabilityQuery = supabase
      .from("teacher_availability")
      .select("*")
      .eq("teacher_id", teacherId);

    if (dateFrom) {
      availabilityQuery = availabilityQuery.gte("date", dateFrom);
    }

    if (dateTo) {
      availabilityQuery = availabilityQuery.lte("date", dateTo);
    }

    const { data: availability, error: availabilityError } = await availabilityQuery;

    if (availabilityError) {
      console.error("Error fetching teacher availability:", availabilityError);
      return NextResponse.json({ error: availabilityError.message }, { status: 500 });
    }

    // Get scheduled lessons for the teacher
    let lessonsQuery = supabase
      .from("lessons")
      .select(`
        *,
        profile:profiles!lessons_student_id_fkey(email, firstName, lastName)
      `)
      .eq("teacher_id", teacherId);

    if (dateFrom) {
      lessonsQuery = lessonsQuery.gte("date", dateFrom);
    }

    if (dateTo) {
      lessonsQuery = lessonsQuery.lte("date", dateTo);
    }

    const { data: lessons, error: lessonsError } = await lessonsQuery;

    if (lessonsError) {
      console.error("Error fetching scheduled lessons:", lessonsError);
      return NextResponse.json({ error: lessonsError.message }, { status: 500 });
    }

    return NextResponse.json({
      availability: availability || [],
      scheduledLessons: lessons || [],
      teacherId
    });
  } catch (error) {
    console.error("Error in lesson schedule API:", error);
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

    // Check if user has permission to manage schedules
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { teacher_id, date, start_time, end_time, is_available } = body;

    if (!teacher_id || !date || !start_time || !end_time) {
      return NextResponse.json(
        { error: "Teacher ID, date, start_time, and end_time are required" },
        { status: 400 }
      );
    }

    // Check for conflicts with existing availability
    const { data: existingAvailability, error: conflictError } = await supabase
      .from("teacher_availability")
      .select("*")
      .eq("teacher_id", teacher_id)
      .eq("date", date)
      .overlaps("start_time", start_time, "end_time", end_time);

    if (conflictError) {
      console.error("Error checking availability conflicts:", conflictError);
      return NextResponse.json({ error: conflictError.message }, { status: 500 });
    }

    if (existingAvailability && existingAvailability.length > 0) {
      return NextResponse.json(
        { error: "Time slot conflicts with existing availability" },
        { status: 409 }
      );
    }

    const { data: availability, error } = await supabase
      .from("teacher_availability")
      .insert({
        teacher_id,
        date,
        start_time,
        end_time,
        is_available: is_available !== false, // Default to true
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating teacher availability:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(availability);
  } catch (error) {
    console.error("Error in lesson schedule creation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 