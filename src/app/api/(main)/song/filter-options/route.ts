import { createClient } from "@/utils/supabase/clients/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    // searchParams is not used in this endpoint

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin - handle missing profile by creating one
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("user_id", user.id)
      .single();

    let userProfile = profile;

    // If no profile exists, create one with default values
    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          email: user.email,
          isAdmin: false,
          isStudent: true,
          isTeacher: false,
          canEdit: false
        })
        .select("isAdmin")
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        return NextResponse.json(
          { error: "Error creating user profile" },
          { status: 500 }
        );
      }

      userProfile = newProfile;
    } else if (profileError) {
      console.error("Error checking permissions:", profileError);
      return NextResponse.json(
        { error: "Error checking user permissions" },
        { status: 500 }
      );
    }

    // Get all unique filter values from the entire database
    let dbQuery = supabase.from('songs').select('level, key, author');

    if (!userProfile?.isAdmin) {
      dbQuery = dbQuery.eq('userId', user.id);
    }

    const { data: songs, error } = await dbQuery;

    if (error) {
      console.error("Error fetching filter options:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Extract unique values
    const levels = Array.from(new Set(songs?.map((song: { level?: string }) => song.level).filter(Boolean) || []));
    const keys = Array.from(new Set(songs?.map((song: { key?: string }) => song.key).filter(Boolean) || []));
    const authors = Array.from(new Set(songs?.map((song: { author?: string }) => song.author).filter(Boolean) || []));

    return NextResponse.json({
      levels: levels.sort(),
      keys: keys.sort(),
      authors: authors.sort()
    });
  } catch (error) {
    console.error("Error in filter options API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 