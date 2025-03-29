import { Song } from "./Song";
import { User } from "./User";

export interface Lesson {
  id: string;
  lesson_number: number;
  student_id: string;
  teacher_id: string;
  created_at: string;
  updated_at: string;
  date: Date;
  time: TimeRanges;
  profile?: User;
  songs: Song[];
  notes: string;
}
