import { createClient } from "@/utils/supabase/clients/client";
import { ErrorComponent } from "../@components/ErrorComponent";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { LoadingState } from "@/components/ui/loading-state";
import Link from "next/link";

interface Profile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  created_at: string;
}

const SORTABLE_FIELDS = [
  { key: "email", label: "Email" },
  { key: "username", label: "Username" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "role", label: "Role" },
  { key: "created_at", label: "Created At" },
];

function getNextSort(currentField: string, currentDir: string, field: string) {
  if (currentField !== field) return "asc";
  return currentDir === "asc" ? "desc" : "asc";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; dir?: string }>;
}) {
  const { sort, dir } = await searchParams;
  const supabase = createClient();

  // Determine sort field and direction
  const sortField = sort || "email";
  const sortDir = dir === "desc" ? "desc" : "asc";

  // Get user profiles
  let data: Profile[] | null = null;
  let error: Error | null = null;
  try {
    let query = supabase.from("profiles").select("*");
    if (sortField === "role") {
      query = query.order("isAdmin", { ascending: sortDir === "asc" });
      query = query.order("isTeacher", { ascending: sortDir === "asc" });
      query = query.order("isStudent", { ascending: sortDir === "asc" });
    } else {
      query = query.order(sortField, { ascending: sortDir === "asc" });
    }
    const res = await query;
    data = res.data;
    error = res.error;
  } catch (e) {
    error = e instanceof Error ? e : new Error("An unknown error occurred");
  }

  if (error) {
    let errorMsg = "Error loading profiles: ";
    if (error.message && error.message.includes("does not exist")) {
      errorMsg += `A column is missing in your database: ${error.message}`;
    } else {
      errorMsg += error.message || error.toString();
    }
    return <ErrorComponent error={errorMsg} />;
  }

  if (!data) {
    return <LoadingState message="Loading students..." />;
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No students found.
      </div>
    );
  }

  function sortIndicator(field: string) {
    if (sortField !== field) return null;
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  function getRole(user: Profile) {
    if (user.isAdmin) return "Admin";
    if (user.isTeacher) return "Teacher";
    if (user.isStudent) return "Student";
    return "-";
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>List of all student profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {SORTABLE_FIELDS.map(({ key, label }) => (
                  <TableHead key={key}>
                    <Link
                      href={`?sort=${key}&dir=${getNextSort(sortField, sortDir, key)}`}
                      className="hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {label}
                      <span>{sortIndicator(key)}</span>
                    </Link>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/students/${user.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {user.email || "-"}
                    </Link>
                  </TableCell>
                  <TableCell>{user.username || "-"}</TableCell>
                  <TableCell>{user.firstName || "-"}</TableCell>
                  <TableCell>{user.lastName || "-"}</TableCell>
                  <TableCell>{getRole(user)}</TableCell>
                  <TableCell>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
