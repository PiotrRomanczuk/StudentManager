import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Get current user for authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get search query for filtering authors
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build query to get unique authors
    let query = supabase
      .from("songs")
      .select("author")
      .not("author", "is", null)
      .not("author", "eq", "")
      .order("author", { ascending: true });

    // Apply search filter if provided
    if (search) {
      query = query.ilike("author", `%${search}%`);
    }

    // Apply limit
    query = query.limit(limit);

    const { data: authors, error } = await query;

    if (error) {
      console.error("Error fetching authors:", error);
      return NextResponse.json(
        { error: "Error fetching authors" },
        { status: 500 }
      );
    }

    // Extract unique authors and sort them
    const uniqueAuthors = [...new Set(authors?.map((song: { author: string }) => song.author).filter(Boolean))].sort();

    return NextResponse.json({
      authors: uniqueAuthors,
      count: uniqueAuthors.length
    });
  } catch (error) {
    console.error("Error in authors API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 