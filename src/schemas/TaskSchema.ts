import * as z from "zod";

// Task priority enum
export const TaskPriorityEnum = z.enum([
  "Critical",
  "High", 
  "Medium",
  "Low"
]);

// Task status enum
export const TaskStatusEnum = z.enum([
  "Not Started",
  "In Progress", 
  "Completed",
  "Blocked"
]);

// Task schema for validation
export const TaskSchema = z.object({
  id: z.string().uuid().optional(), // UUID, auto-generated
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  priority: TaskPriorityEnum.default("Medium"),
  status: TaskStatusEnum.default("Not Started"),
  estimated_effort: z.string().optional(),
  assignee_id: z.string().uuid().optional(),
  due_date: z.date().optional(),
  created_by: z.string().uuid("Created by user ID is required"),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  completed_at: z.date().optional(),
  tags: z.array(z.string()).optional(),
  external_link: z.string().url().optional(),
  notes: z.string().optional(),
});

// Task input schema for creating/updating tasks
export const TaskInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  priority: TaskPriorityEnum.optional(),
  status: TaskStatusEnum.optional(),
  estimated_effort: z.string().optional(),
  assignee_id: z.string().uuid().optional(),
  due_date: z.string().datetime().optional(), // ISO date string
  tags: z.array(z.string()).optional(),
  external_link: z.string().url().optional(),
  notes: z.string().optional(),
});

// Task update schema (for partial updates)
export const TaskUpdateSchema = TaskInputSchema.partial().extend({
  id: z.string().uuid("Task ID is required"),
});

// Task with assignee profile information
export const TaskWithAssigneeSchema = TaskSchema.extend({
  assignee_profile: z.object({
    user_id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }).optional(),
  created_by_profile: z.object({
    user_id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }).optional(),
});

// Task filter schema
export const TaskFilterSchema = z.object({
  category: z.string().optional(),
  priority: TaskPriorityEnum.optional(),
  status: TaskStatusEnum.optional(),
  assignee_id: z.string().uuid().optional(),
  search: z.string().optional(),
  due_date_from: z.string().datetime().optional(),
  due_date_to: z.string().datetime().optional(),
});

// Task sort schema
export const TaskSortSchema = z.object({
  field: z.enum([
    "title",
    "category", 
    "priority",
    "status",
    "due_date",
    "created_at",
    "updated_at"
  ]),
  direction: z.enum(["asc", "desc"]).default("desc"),
});

// Types
export type Task = z.infer<typeof TaskSchema>;
export type TaskInput = z.infer<typeof TaskInputSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
export type TaskWithAssignee = z.infer<typeof TaskWithAssigneeSchema>;
export type TaskFilter = z.infer<typeof TaskFilterSchema>;
export type TaskSort = z.infer<typeof TaskSortSchema>;
export type TaskPriority = z.infer<typeof TaskPriorityEnum>;
export type TaskStatus = z.infer<typeof TaskStatusEnum>; 