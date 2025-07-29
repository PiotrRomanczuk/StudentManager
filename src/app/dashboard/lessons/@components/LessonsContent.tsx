import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonsTable } from "../LessonsTable";
import { LessonsTableMobile } from "../LessonsTableMobile";
import NoLessons from "../NoLessons";
import type { Lesson } from "@/types/Lesson";

interface LessonsContentProps {
  lessons: Lesson[];
  isAdmin: boolean;
}

export function LessonsContent({ lessons, isAdmin }: LessonsContentProps) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      {lessons.length === 0 ? (
        <NoLessons isAdmin={isAdmin} />
      ) : (
        <>
          <div className="hidden lg:block">
            <LessonsTable lessons={lessons} />
          </div>
          <div className="lg:hidden">
            <LessonsTableMobile lessons={lessons} />
          </div>
        </>
      )}
    </Suspense>
  );
} 