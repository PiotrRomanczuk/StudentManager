import * as z from "zod";

// User favorite schema for validation
export const UserFavoriteSchema = z.object({
  id: z.string().uuid().optional(), // UUID, auto-generated
  user_id: z.string().uuid("User ID is required"),
  song_id: z.string().uuid("Song ID is required"),
  created_at: z.date().optional(),
});

// User favorite input schema for creating favorites
export const UserFavoriteInputSchema = z.object({
  user_id: z.string().uuid("User ID is required"),
  song_id: z.string().uuid("Song ID is required"),
});

// User favorite with song information
export const UserFavoriteWithSongSchema = UserFavoriteSchema.extend({
  song: z.object({
    id: z.string().uuid(),
    title: z.string().optional(),
    author: z.string().optional(),
    level: z.string().optional(),
    key: z.string().optional(),
  }).optional(),
});

// User favorite filter schema
export const UserFavoriteFilterSchema = z.object({
  user_id: z.string().uuid().optional(),
  song_id: z.string().uuid().optional(),
  search: z.string().optional(),
});

// User favorite sort schema
export const UserFavoriteSortSchema = z.object({
  field: z.enum([
    "created_at",
    "song_title",
    "song_author"
  ]),
  direction: z.enum(["asc", "desc"]).default("desc"),
});

// Types
export type UserFavorite = z.infer<typeof UserFavoriteSchema>;
export type UserFavoriteInput = z.infer<typeof UserFavoriteInputSchema>;
export type UserFavoriteWithSong = z.infer<typeof UserFavoriteWithSongSchema>;
export type UserFavoriteFilter = z.infer<typeof UserFavoriteFilterSchema>;
export type UserFavoriteSort = z.infer<typeof UserFavoriteSortSchema>; 