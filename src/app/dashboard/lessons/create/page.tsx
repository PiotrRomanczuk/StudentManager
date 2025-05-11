import { createClient } from "@/utils/supabase/clients/server";
import { createLesson } from "./actions";
import { User } from "@/types/User";

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:00`
  };
}

export default async function Page() {
  const supabase = await createClient();
  const { date, time } = getCurrentDateTime();

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Lesson</h1>
          
          <form className="space-y-6" action={createLesson}>
            <div className="space-y-4">
              <div>
                <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>
                <select
                  id="teacher_id"
                  name="teacher_id"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {teachers?.map((teacher: User) => (
                    <option key={teacher.user_id} value={teacher.user_id}>
                      {teacher.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  id="student_id"
                  name="student_id"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {students?.map((student: User) => (
                    <option key={student.user_id} value={student.user_id}>
                      {student.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    defaultValue={date}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    defaultValue={time}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Create Lesson
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
