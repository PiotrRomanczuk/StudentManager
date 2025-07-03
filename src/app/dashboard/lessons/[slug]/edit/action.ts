import { createClient } from "@/utils/supabase/clients/server";
import { redirect } from "next/navigation";

export const updateLesson = async (formData: FormData) => {
  "use server";
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

  const title = formData.get("title") as string;
  const notes = formData.get("notes") as string;
  const slug = formData.get("slug") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;

  const { error: updateError } = await supabase
    .from("lessons")
    .update({ title, notes, date, time })
    .eq("id", slug);

  if (updateError) {
    console.error(updateError);
    throw new Error("Failed to update lesson.");
  }

  redirect(`/dashboard/lessons/${slug}`);
};
