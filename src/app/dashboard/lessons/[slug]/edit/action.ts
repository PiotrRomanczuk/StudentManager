import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { BASE_URL } from "@/constants/BASE_URL";

export const updateLesson = async (formData: FormData) => {
  "use server";
  
  const title = formData.get("title") as string;
  const notes = formData.get("notes") as string;
  const slug = formData.get("slug") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const status = formData.get("status") as string;

  try {
    const cookieHeader = (await cookies()).toString();
    
    const response = await fetch(`${BASE_URL}/api/lessons/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        title,
        notes,
        date,
        time,
        status,
      }),
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
