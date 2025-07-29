import { cookies } from "next/headers";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { fetchAssignmentsData } from "./api/fetchAssignments";
import { getUserAndAdminStatus } from "@/utils/auth-helpers";
import { ErrorComponent } from "@/app/dashboard/@components/ErrorComponent";

// Enhanced Task type with profile information
interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  teacher_id: number;
  student_id: number;
  teacher_profile?: {
    email: string;
    firstName: string;
    lastName: string;
  };
  student_profile?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

type Params = { user_id: string; sort?: string; filter?: string };

export default async function AssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  try {
    const { user_id, sort = "created_at", filter } = await searchParams;
    const { isAdmin } = await getUserAndAdminStatus();
    const cookieHeader = (await cookies()).toString();

    const { tasks } = await fetchAssignmentsData(user_id, sort, filter, cookieHeader);

    return (
      <div className="container mx-auto py-6">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Assignments</h1>
          {isAdmin && (
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Link
                href="/dashboard/assignments/add"
                className="flex items-center gap-2 px-4 py-2"
              >
                <Plus className="h-5 w-5 text-black" />
                <span className="hidden md:block text-black">
                  Add Assignment
                </span>
              </Link>
            </Button>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium">Title</TableHead>
                <TableHead className="font-medium">Description</TableHead>
                <TableHead className="font-medium">Due Date</TableHead>
                <TableHead className="font-medium">Teacher</TableHead>
                <TableHead className="font-medium">Student</TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks?.map((task: Task) => (
                <TableRow key={task.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.description || "-"}</TableCell>
                  <TableCell>
                    {task.due_date ? new Date(task.due_date).toLocaleString() : "-"}
                  </TableCell>
                  <TableCell>
                    {task.teacher_profile?.email || `ID: ${task.teacher_id}`}
                  </TableCell>
                  <TableCell>
                    {task.student_profile?.email || `ID: ${task.student_id}`}
                  </TableCell>
                  <TableCell>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                    >
                      <Link href={`/dashboard/assignments/${task.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  } catch (error: unknown) {
    return (
      <ErrorComponent
        error={error instanceof Error ? error.message : "An error occurred"}
      />
    );
  }
}
