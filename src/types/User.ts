export interface User {
  user_id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  isTeacher?: boolean;
  isStudent?: boolean;
}
