import { createClient } from "@/utils/supabase/clients/server";
import { SongInputSchema } from "@/schemas/SongSchema";
import { NextRequest, NextResponse } from "next/server";
import { getSongsHandler } from "./handlers";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("user_id", user?.id)
      .single();

    // Parse query parameters
    const level = searchParams.get("level") || undefined;
    const key = searchParams.get("key") || undefined;
    const author = searchParams.get("author") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const result = await getSongsHandler(supabase, user, profile, {
      level,
      key,
      author,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // Calculate pagination info
    const totalPages = Math.ceil((result.count || 0) / limit);
    
    return NextResponse.json({ 
      songs: result.songs, 
      pagination: {
        page,
        limit,
        total: result.count || 0,
        totalPages
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error in songs API:", error);
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

    // Check if user has permission to create songs
    const { data: profile } = await supabase
      .from("profiles")
      .select("isAdmin, isTeacher")
      .eq("user_id", user.id)
      .single();

    if (!profile || (!profile.isAdmin && !profile.isTeacher)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate input data using the schema
    const parseResult = SongInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid song data", details: parseResult.error },
        { status: 400 }
      );
    }

    const { data: song, error } = await supabase
      .from("songs")
      .insert(parseResult.data)
      .select()
      .single();

    if (error) {
      console.error("Error creating song:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(song);
  } catch (error) {
    console.error("Error in song creation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
      .select("isAdmin")
      .eq("user_id", user.id)
      .single();

    if (!profile?.isAdmin && song.userId !== user.id) {
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