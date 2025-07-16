import * as z from "zod";

// Common enums used across the application
export const DifficultyLevelEnum = z.enum([
  "beginner",
  "intermediate", 
  "advanced"
]);

export const MusicKeyEnum = z.enum([
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"
]);

export const FileTypeEnum = z.enum([
  "audio",
  "video", 
  "pdf",
  "image",
  "document"
]);

// Common validation patterns
export const UUIDPattern = z.string().uuid();
export const EmailPattern = z.string().email();
export const URLPattern = z.string().url();
export const DatePattern = z.string().datetime();
export const TimePattern = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);

// Common field schemas
export const IdField = z.string().uuid().optional();
export const EmailField = z.string().email("Valid email is required");
export const PasswordField = z.string().min(8, "Password must be at least 8 characters");
export const NameField = z.string().min(1, "Name is required").max(100, "Name too long");
export const DescriptionField = z.string().max(1000, "Description too long").optional();
export const URLField = z.string().url("Valid URL is required").optional();
export const DateField = z.date().optional();
export const DateTimeField = z.string().datetime().optional();

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().optional(),
});

// Sort schema
export const SortSchema = z.object({
  field: z.string(),
  direction: z.enum(["asc", "desc"]).default("desc"),
});

// Search schema
export const SearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  fields: z.array(z.string()).optional(),
});

// Filter schema
export const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum(["eq", "ne", "gt", "gte", "lt", "lte", "like", "in", "not_in"]),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});

// Date range schema
export const DateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

// File upload schema
export const FileUploadSchema = z.object({
  name: z.string().min(1, "File name is required"),
  type: FileTypeEnum,
  size: z.number().positive("File size must be positive"),
  url: URLField,
});

// Error response schema
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  code: z.string().optional(),
  details: z.record(z.any()).optional(),
});

// Success response schema
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
});

// API response wrapper
export const APIResponseSchema = z.object({
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  status: z.number().optional(),
});

// Validation helper functions
export const validateUUID = (value: string): boolean => {
  try {
    UUIDPattern.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const validateEmail = (value: string): boolean => {
  try {
    EmailPattern.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const validateURL = (value: string): boolean => {
  try {
    URLPattern.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const validateDate = (value: string): boolean => {
  try {
    DatePattern.parse(value);
    return true;
  } catch {
    return false;
  }
};

// Date utilities
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const isValidDate = (date: unknown): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

// String utilities
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

// Types
export type DifficultyLevel = z.infer<typeof DifficultyLevelEnum>;
export type MusicKey = z.infer<typeof MusicKeyEnum>;
export type FileType = z.infer<typeof FileTypeEnum>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type Sort = z.infer<typeof SortSchema>;
export type Search = z.infer<typeof SearchSchema>;
export type Filter = z.infer<typeof FilterSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type APIResponse = z.infer<typeof APIResponseSchema>; 