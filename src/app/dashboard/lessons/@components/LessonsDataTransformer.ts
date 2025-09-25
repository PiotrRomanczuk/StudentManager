import { LessonWithProfiles } from "@/schemas";
import type { Lesson } from "@/types/Lesson";

export function transformLessonsData(lessons: LessonWithProfiles[]): Lesson[] {
  const filtered = lessons.filter((lesson: LessonWithProfiles) => lesson.id && lesson.student_id && lesson.teacher_id);
  const times = filtered.map(l => l.time);
  console.log('[LessonsDataTransformer] All lesson times:', times);
  return filtered.map(lesson => ({
    id: lesson.id!, // We've already filtered for lessons with id
    lesson_number: lesson.lesson_number || 0,
    student_id: lesson.student_id,
    teacher_id: lesson.teacher_id,
    created_at: lesson.created_at?.toString() || new Date().toISOString(),
    updated_at: lesson.updated_at?.toString() || new Date().toISOString(),
    date: new Date(lesson.date || new Date()),
    time: lesson.time || '',
    profile: lesson.profile,
    teacher_profile: lesson.teacher_profile,
    songs: [], // Initialize with empty songs array since API doesn't include songs
    notes: lesson.notes || "",
    title: lesson.title,
    status: lesson.status || "SCHEDULED"
  } as Lesson));
} 