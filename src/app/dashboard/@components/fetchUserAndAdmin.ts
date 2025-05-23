/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchUserAndAdmin(supabase: any) {
  const { data: user, error: userIdError } = await supabase.auth.getUser();
  if (userIdError) throw new Error("Authentication error");

  if (!user?.user?.id) {
    throw new Error("No authenticated user found");
  }

  const { data: userIsAdmin, error: userIsAdminError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", user.user.id)
    .single();

  if (userIsAdminError) throw new Error("Error checking permissions");
  return { user, userIsAdmin };
}
