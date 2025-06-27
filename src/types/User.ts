export interface User {
  user_id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar_url?: string;
  isTeacher?: boolean;
  isStudent?: boolean;
  isAdmin?: boolean;
  canEdit?: boolean;
  isTest?: boolean;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
}
