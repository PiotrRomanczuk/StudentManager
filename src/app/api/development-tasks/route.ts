import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("development_tasks").select("*");

    if (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }

    return NextResponse.json({ tasks: data || [] });
  } catch (error) {
    console.error("Error in GET /api/development-tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      priority,
      status,
      estimatedEffort,
      assigneeId,
      dueDate,
      tags,
      externalLink,
      notes,
    } = body;

    const { error } = await supabase.from("task_management").insert({
      title,
      description,
      category,
      priority,
      status,
      estimated_effort: estimatedEffort,
      assignee_id: assigneeId || null,
      due_date: dueDate || null,
      tags: tags || null,
      external_link: externalLink || null,
      notes: notes || null,
      created_by: user.id,
    });

    if (error) {
      console.error("Error creating task:", error);
      return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }

    return NextResponse.json({ message: "Task created successfully" });
  } catch (error) {
    console.error("Error in POST /api/development-tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      description,
      category,
      priority,
      status,
      estimatedEffort,
      assigneeId,
      dueDate,
      tags,
      externalLink,
      notes,
    } = body;

    const { error } = await supabase.from("development_tasks").update({
      title,
      description,
      category,
      priority,
      status,
      estimated_effort: estimatedEffort,
      assignee_id: assigneeId || null,
      due_date: dueDate || null,
      tags: tags || null,
      external_link: externalLink || null,
      notes: notes || null,
    }).eq("id", id);

    if (error) {
      console.error("Error updating task:", error);
      return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }

    return NextResponse.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error in PUT /api/development-tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("development_tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
      return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/development-tasks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 