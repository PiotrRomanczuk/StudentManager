import { createClient } from "@/utils/supabase/clients/server";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const estimatedEffort = formData.get("estimatedEffort") as string;
  const assigneeId = formData.get("assigneeId") as string;
  const dueDate = formData.get("dueDate") as string;

  const { error } = await supabase.from("task_management").insert({
    title,
    description,
    category,
    priority,
    status,
    estimated_effort: estimatedEffort,
    assignee_id: assigneeId || null,
    due_date: dueDate || null,
    created_by: user.id,
  });

  if (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task.");
  }

  revalidatePath("/dashboard/task-management");
}

export async function updateTask(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const estimatedEffort = formData.get("estimatedEffort") as string;
  const assigneeId = formData.get("assigneeId") as string;
  const dueDate = formData.get("dueDate") as string;

  const { error } = await supabase.from("task_management").update({
    title,
    description,
    category,
    priority,
    status,
    estimated_effort: estimatedEffort,
    assignee_id: assigneeId || null,
    due_date: dueDate || null,
  }).eq("id", id);

  if (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task.");
  }

  revalidatePath("/dashboard/task-management");
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("task_management").delete().eq("id", id);

  if (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task.");
  }

  revalidatePath("/dashboard/task-management");
}
