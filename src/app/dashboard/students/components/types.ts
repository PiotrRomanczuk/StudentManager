export interface Profile {
  id: number;
  user_id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  canEdit?: boolean;
  isActive?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SortableField {
  key: string;
  label: string;
}

export interface StudentsPageProps {
  searchParams: Promise<{ sort?: string; dir?: string }>;
} 