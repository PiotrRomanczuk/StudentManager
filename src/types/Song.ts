export interface Song {
  id: string;
  title: string;
  author: string;
  level: "beginner" | "intermediate" | "advanced";
  key: string;
  chords?: string;
  audio_files?: string;
  ultimate_guitar_link?: string;
  short_title?: string;
  comments?: string;
  created_at: Date;
  updated_at: Date;
  is_favorite?: boolean;
  status?: "to learn" | "started" | "remembered" | "with author" | "mastered"
}

export type CreateSongDTO = Omit<Song, "Id" | "CreatedAt" | "UpdatedAt">;
export type UpdateSongDTO = Partial<CreateSongDTO>;
