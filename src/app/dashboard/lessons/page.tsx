import type { Lesson } from "@/types/Lesson";
import { createClient } from "@/utils/supabase/clients/server";
import { Clock, Plus, User } from "lucide-react";
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

export default async function Page() {
  const supabase = await createClient();
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Lessons</h1>
          <Button asChild>
            <Link href="/dashboard/lessons/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Lesson
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-lg font-medium">Error loading lessons</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please try again later
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pre-fetch all user data to avoid multiple calls
  const userIds = new Set<string>();
  lessons?.forEach((lesson: Lesson) => {
    userIds.add(lesson.student_id);
    userIds.add(lesson.teacher_id);
  });

  const userPromises = Array.from(userIds).map(async (id) => {
    const { data: user } = await supabase
      .from("profiles")
      .select("user_id, email")
      .eq("user_id", id)
      .single();
    return { id, email: user?.email };
  });

  const users = await Promise.all(userPromises);
  const userMap = new Map(users.map((user) => [user.id, user.email]));

  function getUserEmail(id: string) {
    return userMap.get(id) || "Unknown User";
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lessons</h1>
        <Button asChild>
          <Link href="/dashboard/lessons/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Lesson
          </Link>
        </Button>
      </div>

      {!lessons || lessons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-lg font-medium">No lessons found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first lesson to get started
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/lessons/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Lesson
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson: Lesson) => (
            <Card key={lesson.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    {lesson.lesson_number
                      ? `Lesson ${lesson.lesson_number}`
                      : "Lesson"}
                  </CardTitle>
                  <Badge variant="outline">
                    {lesson.date
                      ? formatDate(lesson.date.toString())
                      : formatDate(lesson.created_at)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Student
                      </span>
                      <span className="font-medium">
                        {getUserEmail(lesson.student_id)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        Teacher
                      </span>
                      <span className="font-medium">
                        {getUserEmail(lesson.teacher_id)}
                      </span>
                    </div>
                  </div>

                  {lesson.hour_date && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Time
                        </span>
                        <span className="font-medium">
                          {formatTime(lesson.hour_date)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Updated: {formatDate(lesson.updated_at)}
                </div>
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/dashboard/lessons/${lesson.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
