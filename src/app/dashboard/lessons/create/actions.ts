"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { BASE_URL } from "@/constants/BASE_URL";
import { 
  LessonInputSchema, 
  type LessonInput 
} from "@/schemas";

export async function createLesson(formData: FormData) {
  try {
    // Extract and validate form data
    const teacherId = formData.get("teacher_id") as string;
    const studentId = formData.get("student_id") as string;
    const date = formData.get("date") as string;
  const start_time = formData.get("start_time") as string;
    const title = formData.get("title") as string;
    const notes = formData.get("notes") as string;
    const status = formData.get("status") as string;

    // Prepare data for validation
    const lessonData: Partial<LessonInput> = {
      teacher_id: teacherId,
      student_id: studentId,
      date: date ? new Date(date).toISOString() : undefined,
      start_time: start_time || undefined,
      title: title || undefined,
      notes: notes || undefined,
      status: (status as "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "RESCHEDULED") || undefined,
    };

    // Validate the data using the schema
    let validatedData: LessonInput;
    try {
      validatedData = LessonInputSchema.parse(lessonData);
    } catch (validationError) {
      console.error("Lesson validation error:", validationError);
      throw new Error("Invalid lesson data. Please check all required fields.");
    }

    const cookieHeader = (await cookies()).toString();
    
    const response = await fetch(`${BASE_URL}/api/lessons/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create lesson");
    }

    revalidatePath("/dashboard/lessons");
    redirect("/dashboard/lessons");
  } catch (error) {
    console.error("Error in createLesson:", error);
    throw error;
  }
}
