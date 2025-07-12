import { createClient } from "@/utils/supabase/clients/client";
import { ErrorComponent } from "../@components/ErrorComponent";

export default async function Page() {
  const supabase = createClient();

  // Get user
  const { data: user, error: userIdError } = await supabase.auth.getUser();
  if (userIdError) {
    return <ErrorComponent error="Authentication error" />;
  }

  const { data: userIsAdmin, error: userIsAdminError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", user.user.id)
    .single();

  if (userIsAdminError) {
    return <ErrorComponent error="Error checking permissions" />;
  }

  if (!userIsAdmin?.isAdmin) {
    return (
      <ErrorComponent error="You are not authorized to access this page" />
    );
  }

  const { data: profiles, error } = await supabase.from("profiles").select("*");

  if (error) {
    throw new Error("Error loading profiles:" + error);
  }

  return (
    <div>
      {profiles?.map((profile) => (
        <div key={profile.id}>
          <h1>{profile.email}</h1>
          <h1>{profile.isStudent ? "Student" : "Teacher"}</h1>
        </div>
      ))}
    </div>
  );
}
