import { UUID } from "crypto";

export type LessonSong = {
  lesson_id: UUID;
  song_id: UUID;
  created_at: Date;
  updated_at: Date;
};
