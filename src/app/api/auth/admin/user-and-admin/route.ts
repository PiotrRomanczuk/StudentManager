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

    // First, try to get the existing profile
    const { data: profile, error: userProfileError } = await supabase
      .from("profiles")
      .select("isAdmin, isStudent, isTeacher")
      .eq("user_id", user.user.id)
      .single();

    // If no profile exists, create one with default values
    if (userProfileError && userProfileError.code === 'PGRST116') {
      // PGRST116 is the error code for "no rows returned" when using .single()
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.user.id,
          email: user.user.email,
          isAdmin: false,
          isStudent: true,
          isTeacher: false,
          canEdit: false
        })
        .select("isAdmin, isStudent, isTeacher")
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        return NextResponse.json(
          { error: "Error creating user profile" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        user: { ...user.user },
        isAdmin: newProfile?.isAdmin || false,
      });
    }

    // If there's a different error in profile check, treat as non-admin instead of throwing
    if (userProfileError) {
      console.error("Error checking permissions:", userProfileError);
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