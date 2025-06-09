export interface User {
  user_id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar_url?: string;
  isTeacher?: boolean;
  isStudent?: boolean;
}
