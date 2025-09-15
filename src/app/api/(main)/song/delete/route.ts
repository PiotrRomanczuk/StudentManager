import { createClient } from "@/utils/supabase/clients/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get("id");

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user owns the song or is admin
    const { data: song } = await supabase
      .from("songs")
      .select("userId")
      .eq("id", songId)
      .single();

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Check user role - handle missing profile
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

    if (!userProfile?.isAdmin && song.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("songs")
      .delete()
      .eq("id", songId);

    if (error) {
      console.error("Error deleting song:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in song delete API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}