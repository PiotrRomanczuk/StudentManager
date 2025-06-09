"use server";

import { createClient } from "@/utils/supabase/clients/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createLesson(formData: FormData) {
  const supabase = await createClient();

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // Call the increment_lesson_number function to get the next lesson number
    const { data: lessonNumberData, error: lessonNumberError } =
      await supabase.rpc("increment_lesson_number", {
        p_student_id: studentId,
        p_teacher_id: teacherId,
      });

    if (lessonNumberError) {
      throw new Error("Error fetching lesson number:" + lessonNumberError);
    }

    const lessonNumber = lessonNumberData;

    const { error } = await supabase.from("lessons").insert({
      teacher_id: teacherId,
      student_id: studentId,
      date: date,
      time: time,
      creator_user_id: user.id,
      lesson_number: lessonNumber,
      title: title || null,
      notes: notes || null,
      status: status || "SCHEDULED",
    });

    if (error) {
      console.error(error);
      throw new Error(
        `Error creating lesson: ${error.message || JSON.stringify(error)}`,
      );
    }

    revalidatePath("/dashboard/lessons");
    redirect("/dashboard/lessons");
  } catch (error) {
    console.error("Error in createLesson:", error);
    throw error;
  }
}
