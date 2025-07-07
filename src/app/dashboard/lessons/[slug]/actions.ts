import { cookies } from "next/headers";
import { BASE_URL } from "@/constants/BASE_URL";

export async function deleteLesson(lessonId: string) {
  try {
    const cookieHeader = (await cookies()).toString();
    
    const response = await fetch(`${BASE_URL}/api/lessons/${lessonId}`, {
      method: "DELETE",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete lesson");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
}
