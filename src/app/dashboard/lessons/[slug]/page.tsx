import { createClient } from "@/utils/supabase/clients/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LessonInformation from "./@components/LessonInformation";
import SongInformation from "./@components/SongInformation";
import NoLesson from "./@components/NoLesson";
import LessonError from "./@components/LessonError";
import DeleteButton from "./@components/DeleteButton";
import { formatLessonDate, formatLessonTime } from "../utils/date-formatters";
import { createSerializableLesson } from "../utils/lesson-helpers";

type Params = { slug: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", slug);

  if (error) {
    console.error(error);
    return <LessonError error={error.message} />;
  }

  if (!lessons?.length) {
    return <NoLesson />;
  }

  const lesson = lessons[0];

  // Fetch usernames
  const { data: student } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", lesson.student_id)
    .single();

  const { data: teacher } = await supabase
    .from("profiles")
    .select("email")
    .eq("user_id", lesson.teacher_id)
    .single();

  return (
    <div className="flex flex-col h-full bg-lesson-blue-bg">
      <div className="bg-white shadow-sm border-b border-lesson-blue-border">
        <div className="container mx-auto py-4 px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-lesson-blue-text">Lesson Details</h1>
            <div className="flex gap-3">
              {/* <DeleteButton lessonId={lesson.id} /> */}
              <Button asChild variant="outline" className="hover:bg-lesson-blue-bg">
                <Link href="/dashboard/lessons">Back to Lessons</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto py-6 px-6">
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-lesson-blue-border p-6">
            <LessonInformation
              lesson={createSerializableLesson(lesson)}
              formattedDate={formatLessonDate(lesson.date)}
              formattedTime={formatLessonTime(lesson.time)}
              studentUsername={student?.email || "Unknown"}
              teacherUsername={teacher?.email || "Unknown"}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-lesson-blue-border p-6">
            <SongInformation lesson={lesson} />
          </div>
        </div>
      </div>
    </div>
  );
}
