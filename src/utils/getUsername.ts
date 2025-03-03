import { createClient } from "@/utils/supabase/clients/server";

export async function getUsername(id: string) {
  const supabase = await createClient();
  const { data: user, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", id)
    .single();
  return user?.email;
}
