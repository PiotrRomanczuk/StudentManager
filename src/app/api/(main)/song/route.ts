import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";
import { songInputSchema } from "@/schemas/songInputSchema";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile?.role === "admin") {
      // Admin can see all songs
      const { data: songs, error } = await supabase
        .from("songs")
        .select("*");

      if (error) {
        console.error("Error fetching songs:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(songs);
    } else {
      // Regular users can only see their own songs
      const { data: songs, error } = await supabase
        .from("songs")
        .select("*")
        .eq("userId", user.id);

      if (error) {
        console.error("Error fetching user songs:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(songs);
    }
  } catch (error) {
    console.error("Error in songs GET API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    const parseResult = songInputSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation error:", parseResult.error);
      return NextResponse.json(
        { error: "Invalid input", details: parseResult.error.errors },
        { status: 400 },
      );
    }
    const validated = parseResult.data;

    // Check for required fields
    if (!validated.title || validated.title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Map input fields to DB fields
    const dbSong = {
      title: validated.title,
      author: validated.author,
      level: validated.level,
      key: validated.key,
      chords: validated.chords,
      audio_files: validated.audio_files,
      ultimate_guitar_link: validated.ultimate_guitar_link,
      short_title: validated.short_title,
      userId: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: existingSong } = await supabase
      .from("songs")
      .select("id")
      .eq("title", validated.title)
      .maybeSingle();

    if (existingSong) {
      return NextResponse.json(
        { error: "A song with this title already exists." },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("songs")
      .insert([dbSong])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      if (error.code === "23505") {
        // Unique constraint violation (duplicate title)
        return NextResponse.json(
          { error: "A song with this title already exists." },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: unknown) {
    console.error("Unexpected error:", err);
    let errorMsg = "Failed to create song";
    
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'object' && err !== null && 'error' in err) {
      const errorData = err as { error?: string; details?: unknown };
      errorMsg = errorData.error || "Failed to create song";
      
      if (errorData.details) {
        if (Array.isArray(errorData.details)) {
          // Zod validation errors
          errorMsg += ": " + errorData.details.map((d: { message?: string }) => d.message || "Unknown error").join("; ");
        } else if (typeof errorData.details === "string") {
          errorMsg += ": " + errorData.details;
        }
      }
    }
    
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get("id");
    const body = await request.json();

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user owns the song or is admin
    const { data: song } = await supabase
      .from("songs")
      .select("userId")
      .eq("id", songId)
      .single();

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Check user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile?.role !== "admin" && song.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("songs")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", songId)
      .select()
      .single();

    if (error) {
      console.error("Error updating song:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in song update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get("id");

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user owns the song or is admin
    const { data: song } = await supabase
      .from("songs")
      .select("userId")
      .eq("id", songId)
      .single();

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Check user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile?.role !== "admin" && song.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("songs")
      .delete()
      .eq("id", songId);

    if (error) {
      console.error("Error deleting song:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in song delete API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 