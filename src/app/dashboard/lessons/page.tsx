import { Lesson } from "@/types/Lesson";
import { createClient } from "@/utils/supabase/clients/server";
import Link from "next/link";

export default async function Page() {
  const supabase = await createClient();
  const { data: lessons, error } = await supabase.from("lessons").select("*");

  if (error) {
    console.error(error);
    return <div>Error loading lessons</div>;
  }

  async function getUsername(id: string) {
    const { data: user, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("user_id", id)
      .single();
    return user?.email;
  }

  // console.log(lessons)
  return (
    <div>
      {lessons.map((lesson: Lesson) => (
        <div key={lesson.id} className="border p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-bold mb-2">Lesson ID: {lesson.id}</h2>
          <p className="text-gray-700">Student: {getUsername(lesson.student_id)}</p>
          <p className="text-gray-700">Teacher: {getUsername(lesson.teacher_id)}</p>
          <p className="text-gray-500 text-sm">Created: {lesson.created_at}</p>
          <p className="text-gray-500 text-sm">Updated: {lesson.updated_at}</p>
        </div>
      ))}

      <Link className="bg-blue-500 text-white p-2 rounded-md mt-8" href="/dashboard/lessons/create">Create Lesson</Link>
    </div>
  );
}
