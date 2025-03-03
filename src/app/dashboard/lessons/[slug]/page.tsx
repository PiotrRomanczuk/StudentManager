import type { Song } from "@/types/Song";
import { getUsername } from "@/utils/getUsername";
import { createClient } from "@/utils/supabase/clients/server";
import { CalendarDays, Clock, Edit, Music, User } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Params = { slug: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  console.log("Resolved Params:", slug);

  const supabase = await createClient();
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", slug);

  if (error) {
    console.error(error);
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <p className="text-lg font-medium">Error loading lesson data.</p>
              <p className="text-sm text-muted-foreground">
                Please try again later.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/lessons">Back to Lessons</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <p className="text-lg font-medium">No lesson found.</p>
              <p className="text-sm text-muted-foreground">
                The lesson you're looking for doesn't exist.
              </p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/lessons">Back to Lessons</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lesson = lessons[0];
  const formattedDate = new Date(lesson.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(lesson.hour_date).toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lesson Details</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/lessons">Back to Lessons</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              Lesson Information
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href={`/dashboard/lessons/${lesson.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Lesson
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Student</span>
                  </div>
                  <p className="font-medium">
                    {getUsername(lesson.student_id)}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Teacher</span>
                  </div>
                  <p className="font-medium">
                    {getUsername(lesson.teacher_id)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
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
                <h3 className="text-sm font-medium text-muted-foreground">
                  Notes
                </h3>
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

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Songs</CardTitle>
              <Badge variant="outline" className="ml-2">
                {lesson.songs?.length || 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!lesson.songs || lesson.songs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Music className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No songs added to this lesson yet.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {lesson.songs.map((song: Song) => (
                  <li key={song.id} className="rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-primary" />
                      <span className="font-medium">{song.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/dashboard/lessons/${lesson.id}/songs`}>
                Manage Songs
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
