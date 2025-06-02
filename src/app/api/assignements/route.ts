import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";

export async function GET() {
  const supabase = await createClient();
  const { data: tasks, error } = await supabase.from("tasks").select("*");

  if (error) {
    // Log the error to the server console for debugging
    console.error("Supabase fetch error:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 },
    );
  }

  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { title, description, due_date, teacher_id, student_id } = body;

  // Validate required fields
  if (!title || !teacher_id || !student_id) {
    return NextResponse.json(
      { error: "Missing required fields: title, teacher_id, student_id" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert([{ title, description, due_date, teacher_id, student_id }])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 },
    );
  }

  return NextResponse.json({ task: data }, { status: 201 });
}
