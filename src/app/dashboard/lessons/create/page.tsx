import { createClient } from "@/utils/supabase/clients/server";
import { createLesson } from "./actions";
import { User } from "@/types/User";
export default async function Page() {
  const supabase = await createClient();

  const { data: students, error: studentsError } = await supabase
    .from("profiles")
    .select("*")
    .eq("isStudent", true);
  const { data: teachers, error: teachersError } = await supabase
    .from("profiles")
    .select("*")
    .eq("isTeacher", true);

  if (studentsError || teachersError) {
    throw new Error(
      "Error fetching students or teachers:" + studentsError + teachersError,
    );
  }

  return (
    <div>
      <form className="flex flex-col gap-4" action={createLesson}>
        Teacher:
        <select name="teacher_id">
          {teachers?.map((teacher: User) => (
            <option key={teacher.user_id} value={teacher.user_id}>
              {teacher.email}
            </option>
          ))}
        </select>
        <br />
        Student:
        <select name="student_id">
          {students?.map((student: User) => (
            <option key={student.user_id} value={student.user_id}>
              {student.email}
            </option>
          ))}
        </select>
        <br />
        Date:
        <input type="date" name="date" />
        <br />
        Time:
        <input type="time" name="time" />
        <br />
        <button type="submit">Create Lesson</button>
      </form>
    </div>
  );
}
