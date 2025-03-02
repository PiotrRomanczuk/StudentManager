import { z } from "zod";

export const songInputSchema = z.object({
  Title: z.string().min(1),
  Author: z.string().min(1),
  Level: z.enum(["beginner", "intermediate", "advanced"]),
  Key: z.string().min(1),
  Chords: z.string().optional(),
  UltimateGuitarLink: z.string().optional(),
  AudioFiles: z.string().optional(),
  ShortTitle: z.string().optional(),
});
