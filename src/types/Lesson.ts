import { Song } from "./Song";

export interface Lesson {
  id: string;
  student_id: string;
  teacher_id: string;
  created_at: string;
  updated_at: string;
  date: Date;
  hour_date: string;

  songs: Song[];
  notes: string;
}
