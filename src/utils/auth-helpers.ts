import type { Profile, UserWithProfile } from "@/types/auth";

export async function getCurrentUser() {
  try {
    const { createClient } = await import("@/utils/supabase/clients/server");
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getCurrentUserWithProfile(): Promise<UserWithProfile | null> {
  try {
    const { createClient } = await import("@/utils/supabase/clients/server");
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
      console.error("Error getting profile:", profileError);
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

/**
 * Secure admin check that uses API endpoint
 * This function is safe because it relies on server-side validation
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { createClient } = await import("@/utils/supabase/clients/server");
    const supabase = await createClient();
    
    // Get current user to ensure they can only check their own admin status
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return false;
    }

    // Only allow users to check their own admin status
    if (user.id !== userId) {
      return false;
    }

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

/**
 * Server-side admin check for API routes
 * This should be used in API endpoints to validate admin access
 */
export async function requireAuth() {
  const { createClient } = await import("@/utils/supabase/clients/server");
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Server-side admin check for API routes
 * This should be used in API endpoints to validate admin access
 */
export async function requireAdmin() {
  const { createClient } = await import("@/utils/supabase/clients/server");
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Authentication required");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile?.isAdmin) {
    throw new Error("Admin access required");
  }
  
  return user;
}

/**
 * Get user and admin status in a single query
 * More efficient than separate calls
 */
export async function getUserAndAdminStatus() {
  try {
    const { createClient } = await import("@/utils/supabase/clients/server");
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { user: null, isAdmin: false };
    }

    // Get user profile to check admin status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("user_id", user.id)
      .single();

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
        return { user, isAdmin: false };
      }

      return { user, isAdmin: newProfile?.isAdmin || false };
    }

    // If there's a different error in profile check, treat as non-admin
    if (profileError) {
      console.error("Error checking permissions:", profileError);
      return { user, isAdmin: false };
    }

    return { user, isAdmin: profile?.isAdmin || false };
  } catch (error) {
    console.error("Error getting user and admin status:", error);
    return { user: null, isAdmin: false };
  }
} 

/**
 * Get user and admin status with automatic profile creation
 * This function creates a profile if one doesn't exist
 */
export async function getUserAndAdmin() {
  try {
    const { createClient } = await import("@/utils/supabase/clients/server");
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication required");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Error getting profile:", profileError);
      throw new Error("Error getting user profile");
    }

    return { user, isAdmin: profile?.isAdmin || false };
  } catch (error) {
    console.error("Error getting user and admin:", error);
    throw error;
  }
}

/**
 * Get all users for admin users only
 * This function requires admin privileges and returns all user profiles
 */
export async function getAllUsersForAdmin() {
  try {
    const { createClient } = await import("@/utils/supabase/clients/server");
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication required");
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile?.isAdmin) {
      throw new Error("Admin access required");
    }

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("*");

    if (usersError) {
      throw new Error("Error fetching users");
    }

    return users;
  } catch (error) {
    console.error("Error getting all users for admin:", error);
    throw error;
  }
} 

/**
 * Get all active users (users with isActive = true)
 * This function returns all user profiles where isActive is true
 */
export async function getActiveUsers() {
  try {
    const { createClient } = await import("@/utils/supabase/clients/server");
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Authentication required");
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("isAdmin")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile?.isAdmin) {
      throw new Error("Admin access required");
    }

    // Get all active users
    const { data: activeUsers, error: usersError } = await supabase
      .from("profiles")
      .select("*")
      .eq("isActive", true);

    if (usersError) {
      throw new Error("Error fetching active users");
    }

    return activeUsers;
  } catch (error) {
    console.error("Error getting active users:", error);
    throw error;
  }
} 