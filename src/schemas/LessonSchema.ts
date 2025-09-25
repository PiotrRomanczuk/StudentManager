import * as z from "zod";

// Lesson status enum
export const LessonStatusEnum = z.enum([
  "SCHEDULED",
  "IN_PROGRESS", 
  "COMPLETED",
  "CANCELLED",
  "RESCHEDULED"
]);

// Lesson schema for validation
export const LessonSchema = z.object({
  id: z.string().uuid().optional(), // UUID, auto-generated
  student_id: z.string().uuid("Student ID is required"),
  teacher_id: z.string().uuid("Teacher ID is required"),
  creator_user_id: z.string().uuid().optional(),
  lesson_number: z.number().int().positive().nullable().optional(),
  lesson_teacher_number: z.number().int().positive().nullable().optional(),
  title: z.string().min(1, "Title is required").nullable().optional(),
  notes: z.string().nullable().optional(),
  date: z.string().nullable().optional(), // ISO date string from database
  start_time: z.string().nullable().optional(), // time (ISO or HH:mm)
  status: LessonStatusEnum.default("SCHEDULED"),
  created_at: z.string().nullable().optional(), // ISO date string from database
  updated_at: z.string().nullable().optional(), // ISO date string from database
});

// Lesson input schema for creating/updating lessons
export const LessonInputSchema = z.object({
  student_id: z.string().uuid("Student ID is required"),
  teacher_id: z.string().uuid("Teacher ID is required"),
  title: z.string().min(1, "Title is required").optional(),
  notes: z.string().optional(),
  date: z.string().datetime().optional(), // ISO date string
  start_time: z.string().optional(), // time (ISO or HH:mm)
 status: LessonStatusEnum.optional(),
});

// Lesson with profile information
export const LessonWithProfilesSchema = LessonSchema.extend({
  profile: z.object({
    user_id: z.string().uuid().optional(),
    id: z.string().uuid().optional(),
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }).optional().nullable(),
  teacher_profile: z.object({
    user_id: z.string().uuid().optional(),
    id: z.string().uuid().optional(),
    email: z.string().email().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }).optional().nullable(),
});

// Lesson song status enum
export const SongStatusEnum = z.enum([
  "to_learn",
  "started", 
  "remembered",
  "with_author",
  "mastered"
]);

// Lesson song relationship schema
export const LessonSongSchema = z.object({
  lesson_id: z.string().uuid(),
  song_id: z.string().uuid(),
  song_status: SongStatusEnum.default("started"),
  student_id: z.string().uuid(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Types
export type Lesson = z.infer<typeof LessonSchema>;
export type LessonInput = z.infer<typeof LessonInputSchema>;
export type LessonWithProfiles = z.infer<typeof LessonWithProfilesSchema>;
export type LessonSong = z.infer<typeof LessonSongSchema>;
export type LessonStatus = z.infer<typeof LessonStatusEnum>;
export type SongStatus = z.infer<typeof SongStatusEnum>; 