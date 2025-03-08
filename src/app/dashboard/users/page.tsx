import { createClient } from "@/utils/supabase/clients/client";

export default async function Page() {
  const supabase = createClient();
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
