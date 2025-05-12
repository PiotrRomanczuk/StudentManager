import { createClient } from "@/utils/supabase/clients/client";
import { ErrorComponent } from "../songs/@components/ErrorComponent";

export default async function Page() {
  const supabase = createClient();

  // Get user
  const { data: user, error: userIdError } = await supabase.auth.getUser();
  if (userIdError) {
    return (
      <ErrorComponent error={`Authentication error: ${userIdError.message}`} />
    );
  }

  const { data: userIsAdmin, error: userIsAdminError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", user.user.id)
    .single();

  if (userIsAdminError) {
    return (
      <ErrorComponent
        error={`Error checking permissions: ${userIsAdminError.message}`}
      />
    );
  }

  if (!userIsAdmin?.isAdmin) {
    return (
      <ErrorComponent error="You are not authorized to access this page" />
    );
  }

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("isStudent", true);

  if (error) {
    throw new Error("Error loading student profiles:" + error);
  }

  return (
    <div>
      {profiles?.map((profile) => (
        <div key={profile.id}>
          <h1>{profile.email}</h1>
          <p>Student ID: {profile.id}</p>
        </div>
      ))}
    </div>
  );
}
