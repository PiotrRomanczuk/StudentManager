import { createClient } from "@/utils/supabase/clients/server";
import { getUserAndAdmin } from "@/app/dashboard/utils/getUserAndAdmin";
import { ErrorComponent } from "@/components/dashboard/ErrorComponent";
import { TaskManagementClient } from "./TaskManagementClient";

export default async function TaskManagementPage() {
  const supabase = await createClient();
  
  try {
    const { user, isAdmin } = await getUserAndAdmin(supabase);

    if (!user?.id) {
      return <ErrorComponent error="Please sign in to access task management" />;
    }

    if (!isAdmin) {
      return <ErrorComponent error="You are not authorized to access task management. Admin privileges required." />;
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <p className="mt-2 text-gray-600">
              Manage project tasks, track progress, and monitor development priorities.
            </p>
          </div>
          <TaskManagementClient />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in task management page:", error);
    return <ErrorComponent error="Failed to load task management" />;
  }
} 