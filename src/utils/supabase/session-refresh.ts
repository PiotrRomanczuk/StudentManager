import { createClient } from "@/utils/supabase/clients/server";

export async function refreshSession() {
  const supabase = await createClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  
  if (!session) {
    return null;
  }
  
  // Check if token is about to expire (within 5 minutes)
  const expiresAt = session.expires_at;
  const now = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60;
  
  if (expiresAt && expiresAt - now < fiveMinutes) {
    const { data: { session: newSession }, error: refreshError } = 
      await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error("Error refreshing session:", refreshError);
      return null;
    }
    
    return newSession;
  }
  
  return session;
}

export async function getValidSession() {
  const session = await refreshSession();
  
  if (!session) {
    throw new Error("No valid session found");
  }
  
  return session;
} 