import type { Lesson } from "@/types/Lesson";
import type { User } from "@/types/User";
import { createClient } from "@/utils/supabase/clients/server";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LessonsTable } from "./LessonsTable";
import { fetchUserAndAdmin } from "../@components/fetchUserAndAdmin";
import SearchBar from "@/components/Search-bar";
import NoLesson from "./[slug]/@components/NoLesson";

type Params = { user_id: string };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const { user_id } = await searchParams;
  const supabase = await createClient();
  const { userIsAdmin } = await fetchUserAndAdmin(supabase);

  console.log(userIsAdmin);
  const query = supabase
    .from("lessons")
    .select("*")
    .order("created_at", { ascending: false });

  if (user_id) {
    query.or(`student_id.eq.${user_id},teacher_id.eq.${user_id}`);
  }

  const { data: lessons, error: lessonsError } = await query;
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*");

  if (lessonsError || profilesError)
    return <>There is a lesson or profile problem</>;

  const lessonsWithProfiles = lessons?.map((lesson: Lesson) => ({
    ...lesson,
    profile: profiles?.find((p: User) => p.user_id === lesson.student_id),
    teacher_profile: profiles?.find((p: User) => p.user_id === lesson.teacher_id),
  }));

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lessons</h1>
        {userIsAdmin && (
          <>
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
          </>
        )}
      </div>
      {!lessons?.length ? (
        <NoLesson />
      ) : (
        <LessonsTable lessons={lessonsWithProfiles} />
      )}
    </div>
  );
}
