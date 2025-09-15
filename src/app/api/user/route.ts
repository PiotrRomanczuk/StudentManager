import { createClient } from "@/utils/supabase/clients/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UserProfileUpdateSchema } from "@/schemas/UserSchema";
import { verifyUserAccess } from "@/utils/admin-helpers";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const includeProfile = searchParams.get('includeProfile') === 'true';
    const includeSongs = searchParams.get('includeSongs') === 'true';

    // Verify user access
    const userResult = await verifyUserAccess();
    if (userResult instanceof NextResponse) {
      return userResult;
    }

    const { user } = userResult;

    // Get user and admin status
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/user-and-admin`, {
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

    const { user: userData, isAdmin } = await userResponse.json();

    // Base response with user data and admin status
    const response: Record<string, unknown> = {
      user: { ...userData },
      isAdmin,
    };

    // If profile data is requested
    if (includeProfile) {
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

    // If songs data is requested
    if (includeSongs) {
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

    // Validate request body
    const validationResult = UserProfileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid request data", 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    // Verify user access
    const userResult = await verifyUserAccess();
    if (userResult instanceof NextResponse) {
      return userResult;
    }

    const { user } = userResult;

    // Prepare update data (remove userId if present)
    const { userId, ...updateData } = body;

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("user_id", userId || user.id)
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