import { User, Session } from "@supabase/supabase-js";

export interface AuthUser extends User {
  // Add any custom user properties here
}

export interface AuthSession extends Session {
  user: AuthUser;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
  error?: AuthError;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  firstName: string;
  lastName: string;
  isStudent: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  canEdit?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserWithProfile {
  user: AuthUser;
  profile: Profile;
} 