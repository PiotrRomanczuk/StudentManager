import { createClient } from "@/utils/supabase/clients/server";

export async function getUsername(id: string) {
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", id)
    .single();
  return user?.email;
}

export async function getUserIsAdmin(id: string) {
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", id)
    .single();
  return user?.isAdmin;
}
