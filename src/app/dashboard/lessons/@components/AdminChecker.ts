import { createClient } from "@/utils/supabase/clients/server";

export async function checkAdminStatus(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", userId)
    .single();
  
  return profile?.isAdmin || false;
} 