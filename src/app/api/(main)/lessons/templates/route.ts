import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { 
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

    const category = searchParams.get("category");
    const teacherId = searchParams.get("teacherId");

    let query = supabase
      .from("lesson_templates")
      .select(`
        *,
        teacher_profile:profiles!lesson_templates_teacher_id_fkey(email, firstName, lastName)
      `);

    if (category) {
      query = query.eq("category", category);
    }

    if (teacherId) {
      query = query.eq("teacher_id", teacherId);
    }

    query = query.order("created_at", { ascending: false });

    const { data: templates, error } = await query;

    if (error) {
      console.error("Error fetching lesson templates:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ templates: templates || [] });
  } catch (error) {
    console.error("Error in lesson templates API:", error);
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

    // Check if user has permission to create templates
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate template data
    const { name, description, category, duration, structure, teacher_id } = body;

    if (!name || !category || !teacher_id) {
      return NextResponse.json(
        { error: "Name, category, and teacher_id are required" },
        { status: 400 }
      );
    }

    const { data: template, error } = await supabase
      .from("lesson_templates")
      .insert({
        name,
        description: description || null,
        category,
        duration: duration || 60,
        structure: structure || null,
        teacher_id,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating lesson template:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error in lesson template creation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 