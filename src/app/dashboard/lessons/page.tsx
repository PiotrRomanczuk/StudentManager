import type { Lesson } from "@/types/Lesson";
import type { User } from "@/types/User";
import { createClient } from "@/utils/supabase/clients/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { LessonsTable } from "./LessonsTable";
import { LessonsTableMobile } from "./LessonsTableMobile";
import { getUserAndAdmin } from "../utils/getUserAndAdmin";
import SearchBar from "@/components/Search-bar";
import NoLesson from "./[slug]/@components/NoLesson";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonFilters } from "./@components/LessonFilters";

type Params = { user_id: string; sort?: string; filter?: string };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const { user_id, sort = "created_at", filter } = await searchParams;
  const supabase = await createClient();
  const { isAdmin } = await getUserAndAdmin(supabase);

  const query = supabase
    .from("lessons")
    .select("*")
    .order(sort, { ascending: false });

  if (user_id) {
    query.or(`student_id.eq.${user_id},teacher_id.eq.${user_id}`);
  }

  if (filter && filter !== "all") {
    query.eq("status", filter);
  }

  const { data: lessons, error: lessonsError } = await query;
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*");

  if (lessonsError || profilesError) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-medium">Error Loading Lessons</h2>
          <p className="text-red-600 text-sm mt-1">
            {lessonsError?.message || profilesError?.message}
          </p>
        </div>
      </div>
    );
  }

  const lessonsWithProfiles = lessons?.map((lesson: Lesson) => ({
    ...lesson,
    profile: profiles?.find((p: User) => p.user_id === lesson.student_id),
    teacher_profile: profiles?.find(
      (p: User) => p.user_id === lesson.teacher_id,
    ),
  }));

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Lessons</h1>
        {isAdmin && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <LessonFilters currentSort={sort} currentFilter={filter || null} />
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <SearchBar profiles={profiles} />
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Link
                  href="/dashboard/lessons/create"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <Plus className="h-5 w-5 text-black" />
                  <span className="hidden md:block text-black">
                    Create Lesson
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      <Suspense
        fallback={
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        }
      >
        {!lessons?.length ? (
          <NoLesson />
        ) : (
          <>
            <div className="block sm:hidden">
              <LessonsTableMobile lessons={lessonsWithProfiles} />
            </div>
            <div className="hidden sm:block">
              <div className="hidden sm:block">
              <LessonsTable lessons={lessonsWithProfiles} />
            </div>
            <div className="block sm:hidden">
              <LessonsTableMobile lessons={lessonsWithProfiles} />
            </div>
            </div>
          </>
        )}
      </Suspense>
    </div>
  );
}
