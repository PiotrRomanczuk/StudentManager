import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserAndAdmin(supabase: SupabaseClient) {
  const { data: user, error: userIdError } = await supabase.auth.getUser();
  if (userIdError) throw new Error("Authentication error");

  if (!user?.user?.id) {
    throw new Error("No authenticated user found");
  }

  // First, try to get the existing profile
  const { data: isAdmin, error: userIsAdminError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", user.user.id)
    .single();

  // If no profile exists, create one with default values
  if (userIsAdminError && userIsAdminError.code === 'PGRST116') {
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
      .select("isAdmin")
      .single();

    if (createError) {
      console.error("Error creating profile:", createError);
      throw new Error("Error creating user profile");
    }

    return { user: { ...user.user }, isAdmin: newProfile?.isAdmin || false };
  }

  // If there's a different error in admin check, treat as non-admin instead of throwing
  if (userIsAdminError) {
    console.error("Error checking permissions:", userIsAdminError);
    return { user: { ...user.user }, isAdmin: false };
  }

  return { user: { ...user.user }, isAdmin: isAdmin?.isAdmin || false };
}
