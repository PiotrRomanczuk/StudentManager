"use server";

import { createClient } from "@/utils/supabase/clients/server";
import { redirect } from "next/navigation";

export async function createLesson(formData: FormData) {
  const supabase = await createClient();

  const teacherId = formData.get("teacher_id");
  const studentId = formData.get("student_id");
  const date = formData.get("date");
  const hour_date = formData.get("time");

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    hour_date: hour_date,
    creator_user_id: user?.id,
    lesson_number: lessonNumber,
    // other_column: otherValue // Uncomment and replace with actual column name if needed
  });

  if (error) {
    throw new Error("Error creating lesson:" + error);
  } else {
    redirect("/dashboard/lessons");
  }
}
