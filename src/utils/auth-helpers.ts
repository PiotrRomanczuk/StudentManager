import { createClient } from "@/utils/supabase/clients/server";
import { getValidSession } from "@/utils/supabase/session-refresh";
import type { Profile, UserWithProfile } from "@/types/auth";

export async function getCurrentUser() {
  try {
    const session = await getValidSession();
    return session.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getCurrentUserWithProfile(): Promise<UserWithProfile | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    return {
      user,
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("Error getting user with profile:", error);
    return null;
  }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return profile?.isAdmin || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  const isAdmin = await isUserAdmin(user.id);
  
  if (!isAdmin) {
    throw new Error("Admin access required");
  }
  
  return user;
} 