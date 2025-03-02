import { Lesson } from "@/types/Lesson";
import { createClient } from "@/utils/supabase/clients/server";

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  console.log('Resolved Params:', slug);

  const supabase = await createClient();
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', slug);

  if (error) {
    console.error(error);
    return <div>Error loading lesson data.</div>;
  }

  if (!lesson || lesson.length === 0) {
    return <div>No lesson found.</div>;
  }

  async function getUsername(id: string) {
    const { data: user, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("user_id", id)
      .single();
    return user?.email;
  }

  return (
    <div>
      {lesson.map((lesson: Lesson) => (
        <div key={lesson.id}>
          <p>Student: {getUsername(lesson.student_id)}</p>
          <p>Teacher: {getUsername(lesson.teacher_id)}</p>
          <p>Created At: {new Date(lesson.created_at).toLocaleString()}</p>
          <p>Updated At: {new Date(lesson.updated_at).toLocaleString()}</p>
          <p>Date: {new Date(lesson.date).toLocaleDateString()}</p>
          <p>Hour Date: {new Date(lesson.hour_date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
