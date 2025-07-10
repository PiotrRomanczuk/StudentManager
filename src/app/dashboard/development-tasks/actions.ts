import { revalidatePath } from "next/cache";

interface TaskData {
  title: string;
  description?: string;
  category: string;
  priority: string;
  status: string;
  estimatedEffort?: string;
  assigneeId?: string;
  dueDate?: string;
}

interface UpdateTaskData extends TaskData {
  id: string;
}

export async function createTask(formData: FormData) {
  const taskData: TaskData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    priority: formData.get("priority") as string,
    status: formData.get("status") as string,
    estimatedEffort: formData.get("estimatedEffort") as string,
    assigneeId: formData.get("assigneeId") as string,
    dueDate: formData.get("dueDate") as string,
  };

  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create task.");
  }

  revalidatePath("/dashboard/task-management");
}

export async function updateTask(formData: FormData) {
  const taskData: UpdateTaskData = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    priority: formData.get("priority") as string,
    status: formData.get("status") as string,
    estimatedEffort: formData.get("estimatedEffort") as string,
    assigneeId: formData.get("assigneeId") as string,
    dueDate: formData.get("dueDate") as string,
  };

  const response = await fetch("/api/tasks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update task.");
  }

  revalidatePath("/dashboard/task-management");
}

export async function deleteTask(id: string) {
  const response = await fetch(`/api/tasks?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete task.");
  }

  revalidatePath("/dashboard/task-management");
}
