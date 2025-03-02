"use server"

import { createClient } from "@/utils/supabase/clients/server"
import { redirect } from "next/navigation"

export async function createLesson(formData: FormData) {
  const supabase = await createClient()

  const teacherId = formData.get('teacher_id')
  const studentId = formData.get('student_id')
  const date = formData.get('date')
  const hour_date = formData.get('time')

  const { data: { user } } = await supabase.auth.getUser()


  

  console.log(`teacherId: ${teacherId}`)
  console.log(`studentId: ${studentId}`)
  console.log(`user?.id: ${user?.id}`)

  const { data: lesson, error } = await supabase.from('lessons').insert({
    teacher_id: teacherId,
    student_id: studentId,
    date: date,
    hour_date: hour_date,
    user_id: user?.id
  })

  console.log(lesson)

  if (error) {
    console.error(error)
  }
  else {
    console.log("Lesson created successfully")
    console.log(lesson)
  }

  redirect("/dashboard/lessons")
}
