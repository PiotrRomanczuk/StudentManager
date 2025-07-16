import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { 
  SongStatusEnum
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

    const { data: lessonSong, error } = await supabase
      .from("lesson_songs")
      .select(`
        *,
        song:songs(title, author, level, key, ultimate_guitar_link),
        lesson:lessons(title, date, status),
        student:profiles!lesson_songs_student_id_fkey(email, firstName, lastName)
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching lesson song:", error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Lesson song assignment not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!lessonSong) {
      return NextResponse.json({ error: "Lesson song assignment not found" }, { status: 404 });
    }

    return NextResponse.json(lessonSong);
  } catch (error) {
    console.error("Error in lesson song API:", error);
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

    // Check if user has permission to update lesson songs
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate the update data
    const { song_status } = body;

    if (song_status) {
      try {
        SongStatusEnum.parse(song_status);
      } catch (validationError) {
        return NextResponse.json(
          { error: "Invalid song status", details: validationError },
          { status: 400 }
        );
      }
    }

    const { data: lessonSong, error } = await supabase
      .from("lesson_songs")
      .update({
        song_status: song_status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        song:songs(title, author, level, key),
        lesson:lessons(title, date, status)
      `)
      .single();

    if (error) {
      console.error("Error updating lesson song:", error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Lesson song assignment not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(lessonSong);
  } catch (error) {
    console.error("Error in lesson song update API:", error);
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

    // Check if user has permission to delete lesson songs
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("lesson_songs")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting lesson song:", error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Lesson song assignment not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in lesson song delete API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 