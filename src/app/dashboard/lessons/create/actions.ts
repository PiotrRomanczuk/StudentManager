"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { BASE_URL } from "@/constants/BASE_URL";

export async function createLesson(formData: FormData) {
  const teacherId = formData.get("teacher_id");
  const studentId = formData.get("student_id");
  const date = formData.get("date");
  const time = formData.get("time");
  const title = formData.get("title");
  const notes = formData.get("notes");
  const status = formData.get("status");

  if (!teacherId || !studentId || !date || !time) {
    throw new Error("Missing required fields");
  }

  try {
    const cookieHeader = (await cookies()).toString();
    
    const response = await fetch(`${BASE_URL}/api/lessons/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        teacherId,
        studentId,
        date,
        time,
        title: title || null,
        notes: notes || null,
        status: status || "SCHEDULED",
      }),
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
