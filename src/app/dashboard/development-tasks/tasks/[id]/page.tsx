import { createClient } from "@/utils/supabase/clients/server";
import { getUserAndAdmin } from "@/app/dashboard/utils/getUserAndAdmin";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { TaskEditClient } from "./TaskEditClient";
import { notFound } from "next/navigation";

interface TaskEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  try {
    const { user, isAdmin } = await getUserAndAdmin(supabase);

    if (!user?.id) {
      return <ErrorComponent error="Please sign in to access task management" />;
    }

    if (!isAdmin) {
      return <ErrorComponent error="You are not authorized to access task management. Admin privileges required." />;
    }

    // Fetch the specific task
    const { data: task, error } = await supabase
      .from("task_management")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !task) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Task</h1>
            <p className="mt-2 text-gray-600">
              Update task details and manage progress.
            </p>
          </div>
          <TaskEditClient task={task} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in task edit page:", error);
    return <ErrorComponent error="Failed to load task" />;
  }
} 