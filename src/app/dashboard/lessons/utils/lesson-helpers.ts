import { Lesson } from "@/types/Lesson";

export const createSerializableLesson = (lesson: Lesson) => ({
  id: lesson.id,
  lesson_number: lesson.lesson_number,
  student_id: lesson.student_id,
  teacher_id: lesson.teacher_id,
  notes: lesson.notes,
  created_at: lesson.created_at,
  updated_at: lesson.updated_at,
});
