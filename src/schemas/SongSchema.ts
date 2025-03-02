import * as z from "zod";

export const SongSchema = z.object({
  Title: z.string().min(1, "Title is required"),
  Author: z.string().min(1, "Author is required"),
  Level: z.enum(["beginner", "intermediate", "advanced"]),
  SongKey: z.string().min(1, "Key is required"),
  Chords: z.string().optional(),
  AudioFiles: z.string().optional(),
  ShortTitle: z.string().optional(),
});
