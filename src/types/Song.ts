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
  created_at: Date;
  updated_at: Date;
}

export type CreateSongDTO = Omit<Song, "Id" | "CreatedAt" | "UpdatedAt">;
export type UpdateSongDTO = Partial<CreateSongDTO>;
