import * as z from "zod";
import { DifficultyLevelEnum, MusicKeyEnum, URLField } from "./CommonSchema";

// Song schema for validation
export const SongSchema = z.object({
  id: z.string().uuid().optional(), // UUID, auto-generated
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  author: z.string().min(1, "Author is required").max(100, "Author name too long"),
  level: DifficultyLevelEnum,
  key: MusicKeyEnum,
  chords: z.string().optional(),
  audio_files: z.any().optional(), // JSONB field - can be any JSON value
  ultimate_guitar_link: URLField,
  short_title: z.string().max(50, "Short title too long").optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Song input schema for creating/updating songs
export const SongInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  author: z.string().min(1, "Author is required").max(100, "Author name too long"),
  level: DifficultyLevelEnum,
  key: MusicKeyEnum,
  chords: z.string().optional(),
  ultimate_guitar_link: URLField,
  audio_files: z.any().optional(),
  short_title: z.string().max(50, "Short title too long").optional(),
});

// Song update schema (for partial updates)
export const SongUpdateSchema = SongInputSchema.partial().extend({
  id: z.string().uuid("Song ID is required"),
});

// Song with lesson information
export const SongWithLessonsSchema = SongSchema.extend({
  lessons: z.array(z.object({
    lesson_id: z.string().uuid(),
    song_status: z.enum(["to_learn", "started", "remembered", "with_author", "mastered"]),
    created_at: z.date().optional(),
  })).optional(),
});

// Song filter schema
export const SongFilterSchema = z.object({
  level: DifficultyLevelEnum.optional(),
  key: MusicKeyEnum.optional(),
  author: z.string().optional(),
  search: z.string().optional(),
  has_audio: z.boolean().optional(),
  has_chords: z.boolean().optional(),
});

// Song sort schema
export const SongSortSchema = z.object({
  field: z.enum([
    "title",
    "author",
    "level",
    "key",
    "created_at",
    "updated_at"
  ]),
  direction: z.enum(["asc", "desc"]).default("desc"),
});

// Song search schema
export const SongSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  fields: z.array(z.enum(["title", "author", "chords"])).optional(),
  level: DifficultyLevelEnum.optional(),
  key: MusicKeyEnum.optional(),
});

// Song search parameters schema (for API routes)
export const SongSearchParamsSchema = z.object({
  q: z.string().optional(),
  level: DifficultyLevelEnum.optional(),
  key: MusicKeyEnum.optional(),
  author: z.string().optional(),
  hasAudio: z.string().optional(),
  hasChords: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

// Song import schema (for bulk operations)
export const SongImportSchema = z.object({
  songs: z.array(SongInputSchema),
  overwrite: z.boolean().default(false),
  validate_only: z.boolean().default(false),
});

// Song import validation schema (for validation mode)
export const SongImportValidationSchema = z.object({
  songs: z.array(z.any()), // Allow any object for validation
  overwrite: z.boolean().default(false),
  validate_only: z.boolean().default(false),
});

// Song export schema
export const SongExportSchema = z.object({
  format: z.enum(["json", "csv", "pdf"]).default("json"),
  filters: SongFilterSchema.optional(),
  include_lessons: z.boolean().default(false),
  include_audio_urls: z.boolean().default(false),
});

// Song statistics schema
export const SongStatsSchema = z.object({
  total_songs: z.number().int().nonnegative(),
  songs_by_level: z.record(z.string(), z.number()),
  songs_by_key: z.record(z.string(), z.number()),
  songs_with_audio: z.number().int().nonnegative(),
  songs_with_chords: z.number().int().nonnegative(),
  average_songs_per_author: z.number().positive(),
});

// Types
export type Song = z.infer<typeof SongSchema>;
export type SongInput = z.infer<typeof SongInputSchema>;
export type SongUpdate = z.infer<typeof SongUpdateSchema>;
export type SongWithLessons = z.infer<typeof SongWithLessonsSchema>;
export type SongFilter = z.infer<typeof SongFilterSchema>;
export type SongSort = z.infer<typeof SongSortSchema>;
export type SongSearch = z.infer<typeof SongSearchSchema>;
export type SongSearchParams = z.infer<typeof SongSearchParamsSchema>;
export type SongImport = z.infer<typeof SongImportSchema>;
export type SongImportValidation = z.infer<typeof SongImportValidationSchema>;
export type SongExport = z.infer<typeof SongExportSchema>;
export type SongStats = z.infer<typeof SongStatsSchema>;
