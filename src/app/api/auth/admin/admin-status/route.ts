import { createClient } from "@/utils/supabase/clients/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Get current user to ensure they can only check their own admin status
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only allow users to check their own admin status
    if (user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: Can only check own admin status" },
        { status: 403 }
      );
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error checking admin status:", error);
      return NextResponse.json(
        { error: "Error checking admin status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      isAdmin: profile?.isAdmin || false,
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 