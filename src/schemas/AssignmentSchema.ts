import * as z from "zod";

// Assignment status enum
export const AssignmentStatusEnum = z.enum([
  "Not Started",
  "In Progress", 
  "Completed",
  "Overdue",
  "Cancelled"
]);

// Assignment schema for validation
export const AssignmentSchema = z.object({
  id: z.number().int().positive().optional(), // bigint, auto-generated
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.date().optional(),
  teacher_id: z.number().int().positive("Teacher ID is required"),
  student_id: z.number().int().positive("Student ID is required"),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Assignment input schema for creating/updating assignments
export const AssignmentInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().datetime().optional(), // ISO date string
  teacher_id: z.number().int().positive("Teacher ID is required"),
  student_id: z.number().int().positive("Student ID is required"),
});

// Assignment update schema (for partial updates)
export const AssignmentUpdateSchema = AssignmentInputSchema.partial().extend({
  id: z.number().int().positive("Assignment ID is required"),
});

// Assignment with profile information
export const AssignmentWithProfilesSchema = AssignmentSchema.extend({
  teacher_profile: z.object({
    id: z.number().int().positive(),
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }).optional(),
  student_profile: z.object({
    id: z.number().int().positive(),
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }).optional(),
});

// Assignment filter schema
export const AssignmentFilterSchema = z.object({
  teacher_id: z.number().int().positive().optional(),
  student_id: z.number().int().positive().optional(),
  status: AssignmentStatusEnum.optional(),
  search: z.string().optional(),
  due_date_from: z.string().datetime().optional(),
  due_date_to: z.string().datetime().optional(),
});

// Assignment sort schema
export const AssignmentSortSchema = z.object({
  field: z.enum([
    "title",
    "due_date",
    "created_at",
    "updated_at",
    "teacher_id",
    "student_id"
  ]),
  direction: z.enum(["asc", "desc"]).default("desc"),
});

// Assignment status calculation helper
export const calculateAssignmentStatus = (dueDate: Date | null): z.infer<typeof AssignmentStatusEnum> => {
  if (!dueDate) return "Not Started";
  
  const now = new Date();
  const due = new Date(dueDate);
  
  if (due < now) return "Overdue";
  return "Not Started";
};

// Types
export type Assignment = z.infer<typeof AssignmentSchema>;
export type AssignmentInput = z.infer<typeof AssignmentInputSchema>;
export type AssignmentUpdate = z.infer<typeof AssignmentUpdateSchema>;
export type AssignmentWithProfiles = z.infer<typeof AssignmentWithProfilesSchema>;
export type AssignmentFilter = z.infer<typeof AssignmentFilterSchema>;
export type AssignmentSort = z.infer<typeof AssignmentSortSchema>;
export type AssignmentStatus = z.infer<typeof AssignmentStatusEnum>; 