import { createClient } from "@/utils/supabase/clients/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ArrowLeft } from "lucide-react";

type Params = { slug: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const supabase = await createClient();

  // Fetch the lesson data to pre-fill the form
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", slug)
    .single();

  if (lessonError) {
    throw new Error("Error loading lesson data:" + lessonError);
  }

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*");

  if (songsError) {
    throw new Error("Error loading songs:" + songsError);
  }

  return (
    <div className="container max-w-3xl py-10 flex">
      <Link
        href="/dashboard/lessons"
        className="flex items-center text-sm text-muted-foreground mb-6 hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to lessons
      </Link>

      <form
        action={async (formData: FormData) => {
          "use server";
          const supabase = await createClient();

          const title = formData.get("title") as string;
          const notes = formData.get("notes") as string;
          const slug = formData.get("slug") as string;
          const date = formData.get("date") as string;
          const time = formData.get("time") as string;


          const { error: lessonError } = await supabase
            .from("lessons")
            .update({ title, notes, date, time })
            .eq("id", slug);

          if (lessonError) {
            throw new Error("Error updating lesson:" + lessonError);
          }

          return;
        }}
      >
        <input type="hidden" name="slug" value={slug} />{" "}
        {/* Include slug in form data */}
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
                defaultValue={lesson.title}
              />
            </div>

        

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={lesson.date}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                defaultValue={lesson.time}
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
