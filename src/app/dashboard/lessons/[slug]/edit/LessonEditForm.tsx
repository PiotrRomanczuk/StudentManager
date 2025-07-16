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
import { LessonStatusEnum } from "@/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LessonEditFormProps = {
  lesson: Lesson;
  slug: string;
};

export default function LessonEditClientForm({
  lesson,
  slug,
}: LessonEditFormProps) {
  // Get lesson status options from the schema
  const lessonStatusOptions = LessonStatusEnum.options;

  // Format date for input field
  const formatDateForInput = (date: unknown) => {
    if (!date) return "";
    try {
      const dateObj = new Date(date as string);
      return dateObj.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  // Format time for input field
  const formatTimeForInput = (time: unknown) => {
    if (!time) return "";
    // Handle different time formats
    if (typeof time === 'string') {
      return time;
    }
    return "";
  };

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
                defaultValue={lesson.title || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={formatDateForInput(lesson.date)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                defaultValue={formatTimeForInput(lesson.time)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={lesson.status || "SCHEDULED"}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {lessonStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter additional notes or instructions"
                className="min-h-[150px]"
                defaultValue={lesson.notes || ""}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href={`/dashboard/lessons/${slug}`}>Cancel</Link>
            </Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
