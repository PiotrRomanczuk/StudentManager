import { createClient } from "@/utils/supabase/clients/server";

export async function deleteLesson(lessonId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Profile not found");
  }

  if (profile.role !== "admin" && profile.role !== "teacher") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
  if (error) {
    throw new Error(error.message);
  }
}
