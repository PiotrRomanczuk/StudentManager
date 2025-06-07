"use client";

import { Clock, User } from "lucide-react";
import Link from "next/link";
import type { Lesson } from "@/types/Lesson";
import type { User as UserType } from "@/types/User";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationComponent } from "@/app/dashboard/@components/pagination/PaginationComponent";
import { Skeleton } from "@/components/ui/skeleton";

interface LessonWithProfiles extends Lesson {
  profile?: UserType;
  teacher_profile?: UserType;
}

interface LessonsTableMobileProps {
  lessons: LessonWithProfiles[];
  isLoading?: boolean;
}

export function LessonsTableMobile({
  lessons,
  isLoading = false,
}: LessonsTableMobileProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(lessons.length / itemsPerPage);

  const paginatedLessons = lessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function formatDate(dateString: string) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getEmail(email: string) {
    if (!email) return "N/A";
    return email.split("@")[0];
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!lessons.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No lessons found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {paginatedLessons.map((lesson: LessonWithProfiles) => (
          <Card key={lesson.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-lesson-blue-bg flex items-center justify-center">
                    <span className="text-lesson-blue-text font-medium">
                      L{lesson.lesson_number || "?"}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {lesson.lesson_number
                        ? `Lesson ${lesson.lesson_number}`
                        : "Lesson"}
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-1 bg-lesson-blue-bg text-lesson-blue-text border-lesson-blue-border"
                    >
                      {lesson.date
                        ? formatDate(lesson.date.toString())
                        : formatDate(lesson.created_at)}
                    </Badge>
                  </div>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="bg-lesson-blue-bg hover:bg-lesson-blue-bg/80 text-lesson-blue-text border-lesson-blue-border"
                >
                  <Link href={`/dashboard/lessons/${lesson.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-lesson-purple-bg flex items-center justify-center">
                    <User className="h-4 w-4 text-lesson-purple-text" />
                  </div>
                  <span className="text-gray-900">
                    {getEmail(lesson.profile?.email || "")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-lesson-green-bg flex items-center justify-center">
                    <User className="h-4 w-4 text-lesson-green-text" />
                  </div>
                  <span className="text-gray-900">
                    {getEmail(lesson.teacher_profile?.email || "")}
                  </span>
                </div>

                {lesson.time && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-lesson-orange-bg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-lesson-orange-text" />
                    </div>
                    <span className="text-gray-900">
                      {lesson.time.toString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-gray-500">
                    Updated: {formatDate(lesson.updated_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
