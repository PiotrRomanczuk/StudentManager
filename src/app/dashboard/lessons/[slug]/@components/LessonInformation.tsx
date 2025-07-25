"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, CalendarDays, Clock, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/clients/client";
import { redirect } from "next/navigation";
import { LessonStatusEnum } from "@/schemas";

type LessonInformationProps = {
  lesson: {
    id: string;
    lesson_number?: number;
    student_id: string;
    teacher_id: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    status?: string;
  };
  formattedDate: string;
  formattedTime: string;
  studentUsername: string;
  teacherUsername: string;
};

export default function LessonInformation({
  lesson,
  formattedDate,
  formattedTime,
  studentUsername,
  teacherUsername,
}: LessonInformationProps) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      const supabase = await createClient();
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", lesson.id);

      if (error) {
        console.error("Error deleting lesson:", error);
      } else {
        redirect("/dashboard/lessons");
      }
    }
  };

  // Get lesson status options from the schema
  const lessonStatusOptions = LessonStatusEnum.options;
  
  // Validate and format status
  const isValidStatus = lesson.status && lesson.status ? 
    lessonStatusOptions.includes(lesson.status as "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "RESCHEDULED") : 
    false;
  
  const displayStatus = isValidStatus && lesson.status ? 
    lesson.status.replace(/_/g, " ") : 
    "Unknown";

  return (
    <Card className="flex-1 border-lesson-blue-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <CardTitle className="text-xl font-bold text-lesson-blue-text">
            Lesson Information
          </CardTitle>
          {lesson.lesson_number && (
            <span className="ml-2 px-2 py-1 rounded bg-lesson-blue-bg text-lesson-blue-text text-sm font-semibold border border-lesson-blue-border">
              Lesson #{lesson.lesson_number}
            </span>
          )}
          {lesson.status && (
            <span className="ml-2 px-2 py-1 rounded bg-lesson-blue-bg text-lesson-blue-text text-sm font-semibold border border-lesson-blue-border">
              {displayStatus}
            </span>
          )}
        </div>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="hover:bg-lesson-blue-bg hover:text-lesson-blue-text"
        >
          <Link href={`/dashboard/lessons/${lesson.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Lesson
          </Link>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          className="hover:bg-lesson-blue-bg hover:text-lesson-blue-text"
        >
          <Edit className="mr-2 h-4 w-4" />
          Delete Lesson
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-lesson-blue-text">
                <User className="h-4 w-4" />
                <span>Student</span>
              </div>
              <p className="font-medium">{studentUsername}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-lesson-blue-text">
                <User className="h-4 w-4" />
                <span>Teacher</span>
              </div>
              <p className="font-medium">{teacherUsername}</p>
            </div>
          </div>

          <Separator className="bg-lesson-blue-border" />

          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-lesson-blue-text">
                <CalendarDays className="h-4 w-4" />
                <span>Date</span>
              </div>
              <p className="font-medium">{formattedDate}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-lesson-blue-text">
                <Clock className="h-4 w-4" />
                <span>Time</span>
              </div>
              <p className="font-medium">{formattedTime}</p>
            </div>
          </div>

          <Separator className="bg-lesson-blue-border" />

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-lesson-blue-text">Notes</h3>
            <div className="rounded-md bg-lesson-blue-bg p-3">
              <p className="whitespace-pre-line">
                {lesson.notes || "No notes available."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-lesson-blue-text">
        <div>
          Created:{" "}
          {new Date(lesson.created_at.replace(" ", "T")).toLocaleString()}
        </div>
        <div>
          Updated:{" "}
          {new Date(lesson.updated_at.replace(" ", "T")).toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
}
