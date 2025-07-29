import { createClient } from "@/utils/supabase/clients/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const includeProfile = searchParams.get('includeProfile') === 'true';
    const includeSongs = searchParams.get('includeSongs') === 'true';
    const adminMode = searchParams.get('admin') === 'true';

    // Get user and admin status using the API endpoint
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/admin/user-and-admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Authentication error" },
        { status: userResponse.status }
      );
    }

    const { user, isAdmin } = await userResponse.json();

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

    // If songs data is requested
    if (includeSongs) {
      if (isAdmin) {
        // For admins, return all songs
        const { data: songs, error } = await supabase
          .from("songs")
          .select("*")
          .order("title");
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        response.songs = songs;
      } else {
        // For regular users, return their own songs
        const { data: songs, error: songsError } = await supabase
          .from("user_songs")
          .select(`
            *,
            song:songs(*)
          `)
          .eq("user_id", user.id);
        if (songsError) {
          return NextResponse.json(
            { error: songsError.message },
            { status: 500 },
          );
        }
        response.songs = songs;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in user API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Get user and admin status using the API endpoint
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/admin/user-and-admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Authentication error" },
        { status: userResponse.status }
      );
    }

    const { user, isAdmin } = await userResponse.json();

    // Check if user is updating their own profile or is admin
    if (body.userId && body.userId !== user.id && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Can only update own profile" },
        { status: 403 }
      );
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(body)
      .eq("user_id", body.userId || user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error in user update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
