import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const userId = searchParams.get("userId");
    const sort = searchParams.get("sort") || "created_at";
    const filter = searchParams.get("filter");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("tasks")
      .select(`
        *,
        teacher_profile:profiles!tasks_teacher_id_fkey(email, firstName, lastName),
        student_profile:profiles!tasks_student_id_fkey(email, firstName, lastName)
      `)
      .order(sort, { ascending: false });

    if (userId) {
      query = query.or(`teacher_id.eq.${userId},student_id.eq.${userId}`);
    }

    if (filter && filter !== "all") {
      // Add any specific filtering logic here if needed
      // For now, we'll keep it simple
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error in assignments API:", error);
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

    const { title, description, due_date, teacher_id, student_id } = body;

    if (!title || !teacher_id || !student_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        title,
        description: description || null,
        due_date: due_date || null,
        teacher_id,
        student_id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error in task create API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
