import { createClient } from "@/utils/supabase/clients/server";

type Params = Promise<{ lessonId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { lessonId } = await params;
  console.log(lessonId)

  const supabase = await createClient()

  const { data: lesson, error } = await supabase.from('lessons').select('*').eq('id', lessonId)

  if (error) {
    console.error(error)
  }

  console.log(lesson)

  return (
    <div>
      <h1>Lesson {lessonId}</h1>
    </div>
  );
}
