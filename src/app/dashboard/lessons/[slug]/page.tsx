import Link from "next/link";
import { Button } from "@/components/ui/button";
import LessonInformation from "./@components/LessonInformation";
import SongInformation from "./@components/SongInformation";
import NoLesson from "./@components/NoLesson";
import LessonError from "./@components/LessonError";
import { formatLessonDate, formatLessonTime } from "../utils/internal/date-formatters";
import { createSerializableLesson } from "../utils/internal/lesson-helpers";
import { fetchLessonData } from "../api/fetchLessons";
import { cookies } from "next/headers";

type Params = { slug: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  try {
    const { slug } = await params;
    const cookieHeader = (await cookies()).toString();
    
    const lesson = await fetchLessonData(slug, cookieHeader);

    if (!lesson) {
      return <NoLesson />;
    }

    return (
      <div className="flex flex-col h-full bg-lesson-blue-bg">
        <div className="bg-white shadow-sm border-b border-lesson-blue-border">
          <div className="container mx-auto py-4 px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-lesson-blue-text">
                Lesson Details
              </h1>
              <div className="flex gap-3">
                {/* <DeleteButton lessonId={lesson.id} /> */}
                <Button
                  asChild
                  variant="outline"
                  className="hover:bg-lesson-blue-bg"
                >
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
                formattedDate={formatLessonDate(lesson.date || '')}
                formattedTime={formatLessonTime(lesson.time || '')}
                studentUsername={lesson.profile?.email || "Unknown"}
                teacherUsername={lesson.teacher_profile?.email || "Unknown"}
              />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-lesson-blue-border p-6">
              <SongInformation lesson={{ id: String(lesson.id || ''), songs: [] }} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error: unknown) {
    console.error("Error loading lesson:", error);
    return <LessonError error={error instanceof Error ? error.message : "An error occurred"} />;
  }
}
