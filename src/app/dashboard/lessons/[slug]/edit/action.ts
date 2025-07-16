import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { BASE_URL } from "@/constants/BASE_URL";
import { 
  LessonInputSchema, 
  type LessonInput 
} from "@/schemas";

export const updateLesson = async (formData: FormData) => {
  "use server";
  
  try {
    const title = formData.get("title") as string;
    const notes = formData.get("notes") as string;
    const slug = formData.get("slug") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const status = formData.get("status") as string;

    // Prepare data for validation
    const lessonData: Partial<LessonInput> = {
      title: title || undefined,
      notes: notes || undefined,
      date: date ? new Date(date).toISOString() : undefined,
      time: time || undefined,
      status: (status as "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "RESCHEDULED") || undefined,
    };

    // Validate the data using the schema
    let validatedData: Partial<LessonInput>;
    try {
      validatedData = LessonInputSchema.partial().parse(lessonData);
    } catch (validationError) {
      console.error("Lesson update validation error:", validationError);
      throw new Error("Invalid lesson data. Please check all fields.");
    }

    const cookieHeader = (await cookies()).toString();
    
    const response = await fetch(`${BASE_URL}/api/lessons/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update lesson");
    }

    redirect(`/dashboard/lessons/${slug}`);
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }
};
