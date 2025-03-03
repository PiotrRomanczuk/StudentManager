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

  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // console.log(lessons)
  return (
    <div>
      {lessons.map((lesson: Lesson) => (
        <div key={lesson.id} className="border p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-bold mb-2">
            Lesson: {lesson.lesson_number}
          </h2>
          <p className="text-gray-700">
            Student: {getUsername(lesson.student_id)}
          </p>
          <p className="text-gray-700">
            Teacher: {getUsername(lesson.teacher_id)}
          </p>
          <p className="text-gray-500 text-sm">
            Created: {formatDate(lesson.created_at)}
          </p>
          <p className="text-gray-500 text-sm">
            Updated: {formatDate(lesson.updated_at)}
          </p>
          <Link
            className="bg-blue-500 text-white p-2 rounded-md mt-8"
            href={`/dashboard/lessons/${lesson.id}`}
          >
            View Lesson
          </Link>
        </div>
      ))}

      <Link
        className="bg-blue-500 text-white p-2 rounded-md mt-8"
        href="/dashboard/lessons/create"
      >
        Create Lesson
      </Link>
    </div>
  );
}
