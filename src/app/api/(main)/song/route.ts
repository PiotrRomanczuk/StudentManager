import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";
import { getSongsHandler } from "./handlers";

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

    // Parse and clamp query parameters
    const level = searchParams.get("level") || undefined;
    const key = searchParams.get("key") || undefined;
    const author = searchParams.get("author") || undefined;
    const search = searchParams.get("search") || undefined;

    const rawPage = Number(searchParams.get("page"));
    const rawLimit = Number(searchParams.get("limit"));
    const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(100, Math.floor(rawLimit)) : 50;

    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrderParam = (searchParams.get("sortOrder") || "desc").toLowerCase();
    const sortOrder = sortOrderParam === "asc" ? "asc" : "desc";

    const result = await getSongsHandler(supabase, user, userProfile, {
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
