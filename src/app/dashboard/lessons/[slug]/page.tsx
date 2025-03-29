import { createClient } from "@/utils/supabase/clients/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import LessonInformation from "./@components/LessonInformation";
import SongInformation from "./@components/SongInformation";
import NoLesson from "./@components/NoLesson";
import LessonError from "./@components/LessonError";
import DeleteButton from "./@components/DeleteButton"; // Updated import

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

  if (!lessons || lessons.length === 0) {
    return <NoLesson />;
  }

  const lesson = lessons[0];
  const formattedDate = new Date(lesson.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(lesson.time).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  console.log(formattedDate);
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lesson Details</h1>
        <div className="flex gap-2">
          <DeleteButton lessonId={lesson.id} />
          <Button asChild variant="outline">
            <Link href="/dashboard/lessons">Back to Lessons</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <LessonInformation
          lesson={lesson}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
        />

        <SongInformation lesson={lesson} />
      </div>
    </div>
  );
}