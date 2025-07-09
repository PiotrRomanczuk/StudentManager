import { createClient } from "@/utils/supabase/clients/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getUserAndAdmin } from "@/app/dashboard/utils/getUserAndAdmin";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const includeProfile = searchParams.get('includeProfile') === 'true';
    const includeSongs = searchParams.get('includeSongs') === 'true';
    const adminMode = searchParams.get('admin') === 'true';

    // Get user and admin status using the utility function
    const { user, isAdmin } = await getUserAndAdmin(supabase);

    // Check admin access for admin mode
    if (adminMode && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Base response with user data and admin status
    const response: Record<string, unknown> = {
      user: { ...user },
      isAdmin,
    };

    // Admin mode - return all users
    if (adminMode) {
      const { data: users, error } = await supabase
        .from("profiles")
        .select("*")
        .order("email");
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      return NextResponse.json({ users });
    }

    // If profile data is requested
    if (includeProfile) {
      if (isAdmin) {
        // For admins, return all profiles
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*");
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        response.profiles = profiles;
      } else {
        // For regular users, return their own profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (profileError) {
          return NextResponse.json(
            { error: profileError.message },
            { status: 500 },
          );
        }
        response.profile = profile;
      }
    }

    // If songs data is requested (only for non-admin users)
    if (includeSongs && !isAdmin) {
      // Get the user's songs (reuse logic from profiles route)
      // 1. Find lessons where user is student or teacher
      const { data: lessons, error: lessonsError } = await supabase
        .from("lessons")
        .select("id")
        .or(`student_id.eq.${user.id},teacher_id.eq.${user.id}`);
      if (lessonsError) {
        return NextResponse.json(
          { error: "Error fetching lessons" },
          { status: 500 },
        );
      }
      if (!lessons || lessons.length === 0) {
        response.songs = [];
      } else {
        const lessonIds = lessons.map((lesson: { id: string }) => lesson.id);
        // 2. Get lesson_songs for those lessons
        const { data: lessonSongs, error: lessonSongsError } = await supabase
          .from("lesson_songs")
          .select("song_id, song_status")
          .in("lesson_id", lessonIds);
        if (lessonSongsError) {
          return NextResponse.json(
            { error: "Error fetching lesson songs" },
            { status: 500 },
          );
        }
        if (!lessonSongs || lessonSongs.length === 0) {
          response.songs = [];
        } else {
          const songIdToStatus = lessonSongs.reduce(
            (
              acc: Record<string, string>,
              ls: { song_id: string; song_status: string },
            ) => {
              acc[ls.song_id] = ls.song_status;
              return acc;
            },
            {},
          );
          const songIds = lessonSongs.map((ls: { song_id: string }) => ls.song_id);
          // 3. Get song details
          const { data: songs, error: songsError } = await supabase
            .from("songs")
            .select("*")
            .in("id", songIds);
          if (songsError) {
            return NextResponse.json(
              { error: "Error fetching user songs" },
              { status: 500 },
            );
          }
          // Combine song details with their status as a property on each song
          const songsWithStatus = songs.map((song: Record<string, unknown>) => ({
            ...song,
            status: songIdToStatus[(song as { id: string }).id] || null,
          }));
          response.songs = songsWithStatus;
        }
      }
    }

    return NextResponse.json(response);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    if (
      errorMessage === "Authentication error" ||
      errorMessage === "No authenticated user found"
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  
  try {
    const { isAdmin } = await getUserAndAdmin(supabase);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, isActive } = body;

    if (userId === undefined || isActive === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: userId and isActive" },
        { status: 400 }
      );
    }

    // Update the user's isActive status
    const { data, error } = await supabase
      .from("profiles")
      .update({ isActive })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user: data,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully` 
    });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
