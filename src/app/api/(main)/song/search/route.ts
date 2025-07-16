import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/clients/server";
import { } from "@/schemas/SongSchema";
import { PaginationSchema } from "@/schemas/CommonSchema";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate search parameters
    const searchQuery = searchParams.get("q") || "";
    const level = searchParams.get("level");
    const key = searchParams.get("key");
    const author = searchParams.get("author");
    const hasAudio = searchParams.get("hasAudio");
    const hasChords = searchParams.get("hasChords");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Validate pagination
    const paginationResult = PaginationSchema.safeParse({ page, limit });
    if (!paginationResult.success) {
      return NextResponse.json(
        { error: "Invalid pagination parameters", details: paginationResult.error },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase.from("songs").select("*", { count: "exact" });

    // Apply search filter
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%,chords.ilike.%${searchQuery}%`);
    }

    // Apply filters
    if (level) query = query.eq("level", level);
    if (key) query = query.eq("key", key);
    if (author) query = query.ilike("author", `%${author}%`);
    if (hasAudio === "true") query = query.not("audio_files", "is", null);
    if (hasChords === "true") query = query.not("chords", "is", null);

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: songs, error, count } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching songs:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      songs: songs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      filters: {
        search: searchQuery,
        level,
        key,
        author,
        hasAudio,
        hasChords,
      },
    });
  } catch (error) {
    console.error("Error in song search API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 