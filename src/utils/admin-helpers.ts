import { createClient } from "@/utils/supabase/clients/server";
import { NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";

export interface AdminAuthResult {
  user: User;
  isAdmin: boolean;
  error?: string;
  status?: number;
}

/**
 * Verifies that the current user is authenticated and is an admin
 * Returns the user and admin status, or an error response
 */
export async function verifyAdminAccess(): Promise<AdminAuthResult | NextResponse> {
  try {
    const supabase = await createClient();
    
    // First, verify the current user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if the current user is an admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Error checking admin status:", profileError);
      return NextResponse.json(
        { error: "Error checking permissions" },
        { status: 500 }
      );
    }

    if (!profile?.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return {
      user,
      isAdmin: profile.isAdmin
    };
  } catch (error) {
    console.error("Error in verifyAdminAccess:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Verifies that the current user is authenticated
 * Returns the user, or an error response
 */
export async function verifyUserAccess(): Promise<{ user: User } | NextResponse> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return { user };
  } catch (error) {
    console.error("Error in verifyUserAccess:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Validates UUID format for user IDs
 */
export function validateUserId(userId: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
} 