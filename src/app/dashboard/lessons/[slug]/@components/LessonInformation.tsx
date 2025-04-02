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

type LessonInformationProps = {
  lesson: {
    id: string;
    student_id: string;
    teacher_id: string;
    notes?: string;
    created_at: string;
    updated_at: string;
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
      const { error } = await supabase.from("lessons").delete().eq("id", lesson.id);

      if (error) {
        console.error("Error deleting lesson:", error);
      } else {
        redirect("/dashboard/lessons");
      }
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Lesson Information</CardTitle>
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/lessons/${lesson.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Lesson
          </Link>
        </Button>
        <Button size="sm" variant="outline" onClick={handleDelete}>
          <Edit className="mr-2 h-4 w-4" />
          Delete Lesson
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Student</span>
              </div>
              <p className="font-medium">{studentUsername}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Teacher</span>
              </div>
              <p className="font-medium">{teacherUsername}</p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Date</span>
              </div>
              <p className="font-medium">{formattedDate}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Time</span>
              </div>
              <p className="font-medium">{formattedTime}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
            <div className="rounded-md bg-muted p-3">
              <p className="whitespace-pre-line">
                {lesson.notes || "No notes available."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div>Created: {new Date(lesson.created_at).toLocaleString()}</div>
        <div>Updated: {new Date(lesson.updated_at).toLocaleString()}</div>
      </CardFooter>
    </Card>
  );
}
