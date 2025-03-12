

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { updateLesson } from "./action";
import { Lesson } from "@/types/Lesson";

type LessonEditFormProps = {
  lesson: Lesson;
  slug: string;
};

export default function LessonEditClientForm({ lesson, slug }: LessonEditFormProps) {
  return (
    <div className="container max-w-3xl py-10 flex">
      <Link
        href="/dashboard/lessons"
        className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to lessons
      </Link>

      <form action={updateLesson}>
        <input type="hidden" name="slug" value={slug} />
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Lesson</CardTitle>
            <CardDescription>
              Make changes to your lesson information below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter lesson title"
                defaultValue={lesson.lesson_number}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                // defaultValue={lesson.date.toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                defaultValue={lesson.hour_date}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter additional notes or instructions"
                className="min-h-[150px]"
                defaultValue={lesson.notes}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

