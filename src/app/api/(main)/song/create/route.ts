import { createClient } from "@/utils/supabase/clients/server";
import { SongInputSchema } from "@/schemas/SongSchema";
import { NextRequest, NextResponse } from "next/server";

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
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "teacher")) {
      return NextResponse.json({ error: "You are not authorized to create songs" }, { status: 403 });
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
