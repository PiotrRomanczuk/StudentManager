import { getUserAndAdminStatus } from "@/utils/auth-helpers";
import { ErrorComponent } from "@/app/dashboard/@components/ErrorComponent";
import { TaskManagementClient } from "./TaskManagementClient";

export default async function DevelopmentTasksPage() {
  try {
    const { user, isAdmin } = await getUserAndAdminStatus();

    if (!user?.id) {
      return <ErrorComponent error="Please sign in to access task management" />;
    }

    if (!isAdmin) {
      return <ErrorComponent error="You are not authorized to access task management. Admin privileges required." />;
    }

    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="mt-2 text-gray-600">
            Manage project tasks, track progress, and monitor development priorities.
          </p>
        </div>
        <TaskManagementClient />
      </div>
    );
  } catch (error) {
    console.error("Error in task management page:", error);
    return <ErrorComponent error="Failed to load task management" />;
  }
} 