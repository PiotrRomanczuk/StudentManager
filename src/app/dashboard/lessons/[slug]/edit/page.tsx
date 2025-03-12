import { createClient } from "@/utils/supabase/clients/server";
import LessonEditForm from "./LessonEditForm";

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
    console.error("Error loading lesson data:", lessonError);
    throw new Error("Failed to load lesson data.");
  }



  return <LessonEditForm lesson={lesson} slug={slug} />;
}
