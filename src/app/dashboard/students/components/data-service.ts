import { createClient } from "@/utils/supabase/clients/client";
import { Profile } from "./types";

export async function fetchProfiles(sortField: string, sortDir: string): Promise<{
  data: Profile[] | null;
  error: Error | null;
}> {
  const supabase = createClient();

  try {
    let query = supabase.from("profiles").select(`
      id,
      user_id,
      email,
      username,
      firstName,
      lastName,
      bio,
      isAdmin,
      isTeacher,
      isStudent,
      canEdit,
      isActive,
      created_at,
      updated_at
    `);
    
    if (sortField === "role") {
      query = query.order("isAdmin", { ascending: sortDir === "asc" });
      query = query.order("isTeacher", { ascending: sortDir === "asc" });
      query = query.order("isStudent", { ascending: sortDir === "asc" });
    } else {
      query = query.order(sortField, { ascending: sortDir === "asc" });
    }
    
    const res = await query;
    return { data: res.data, error: res.error };
  } catch (e) {
    const error = e instanceof Error ? e : new Error("An unknown error occurred");
    return { data: null, error };
  }
} 