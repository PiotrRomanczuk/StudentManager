import { z } from "zod";

export const songInputSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  key: z.string().min(1),
  chords: z.string().optional(),
  ultimate_guitar_link: z.string().optional(),
  audio_files: z.string().optional(),
  short_title: z.string().optional(),
});
