import { LessonSchema, type Lesson as SchemaLesson, type LessonWithProfiles } from "@/schemas";

export const createSerializableLesson = (lesson: LessonWithProfiles) => {
  // Validate the lesson against the schema
  try {
    const validatedLesson = LessonSchema.parse(lesson);
    return {
      id: validatedLesson.id || '',
      lesson_number: validatedLesson.lesson_number,
      student_id: validatedLesson.student_id || '',
      teacher_id: validatedLesson.teacher_id || '',
      title: validatedLesson.title,
      notes: validatedLesson.notes,
      date: validatedLesson.date,
      time: validatedLesson.time,
      status: validatedLesson.status,
      created_at: String(validatedLesson.created_at || ''),
      updated_at: String(validatedLesson.updated_at || ''),
    };
  } catch (error) {
    console.error("Lesson validation error:", error);
    // Return a safe fallback
    return {
      id: lesson.id || '',
      lesson_number: lesson.lesson_number,
      student_id: lesson.student_id || '',
      teacher_id: lesson.teacher_id || '',
      title: lesson.title,
      notes: lesson.notes,
      date: lesson.date,
      time: lesson.time,
      status: lesson.status,
      created_at: String(lesson.created_at || ''),
      updated_at: String(lesson.updated_at || ''),
    };
  }
};

export const validateLessonData = (data: unknown): SchemaLesson | null => {
  try {
    return LessonSchema.parse(data);
  } catch (error) {
    console.error("Lesson validation failed:", error);
    return null;
  }
};

export const formatLessonStatus = (status: string | undefined): string => {
  if (!status) return "Unknown";
  
  // Validate against schema enum
  const validStatuses = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED"];
  const isValidStatus = validStatuses.includes(status.toUpperCase());
  
  if (isValidStatus) {
    return status.replace(/_/g, " ");
  }
  
  return "Unknown";
};
