import { UUID } from "crypto";

enum SongStatus {
  TO_LEARN = "to_learn",
  STARTED = "started",
  REMEMBERED = "remembered",
  WITH_AUTHOR = "with_author",
  MASTERED = "mastered",
}

export type LessonSong = {
  lesson_id: UUID;
  song_id: UUID;
  created_at: Date;
  updated_at: Date;
  student_id: UUID;
  teacher_id: UUID;
  song_status: SongStatus;
};
