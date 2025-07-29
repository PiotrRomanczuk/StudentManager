import { SortableField } from "./types";

export const SORTABLE_FIELDS: SortableField[] = [
  { key: "email", label: "Email" },
  { key: "username", label: "Username" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "role", label: "Role" },
  { key: "created_at", label: "Created At" },
];

export function getNextSort(currentField: string, currentDir: string, field: string) {
  if (currentField !== field) return "asc";
  return currentDir === "asc" ? "desc" : "asc";
}

export function getRole(user: { isAdmin: boolean; isTeacher: boolean; isStudent: boolean }) {
  if (user.isAdmin) return "Admin";
  if (user.isTeacher) return "Teacher";
  if (user.isStudent) return "Student";
  return "-";
} 