import { createClient } from "@/utils/supabase/clients/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: user, error: userIdError } = await supabase.auth.getUser();
    
    if (userIdError) {
      return NextResponse.json(
        { error: "Authentication error" },
        { status: 401 }
      );
    }

    if (!user?.user?.id) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }

    // Get the user's profile to check admin status
    const { data: profile, error: userProfileError } = await supabase
      .from("profiles")
      .select("isAdmin, isStudent, isTeacher")
      .eq("user_id", user.user.id)
      .single();

    // If no profile exists, return user without admin privileges
    if (userProfileError) {
      console.error("Error checking user profile:", userProfileError);
      return NextResponse.json({
        user: { ...user.user },
        isAdmin: false,
      });
    }

    return NextResponse.json({
      user: { ...user.user },
      isAdmin: profile?.isAdmin || false,
    });
  } catch (error) {
    console.error("Error getting user and admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 