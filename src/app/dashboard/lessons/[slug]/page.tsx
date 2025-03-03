import { Lesson } from "@/types/Lesson";
import { Song } from "@/types/Song";
import { getUsername } from "@/utils/getUsername";
import { createClient } from "@/utils/supabase/clients/server";
import Link from "next/link";

type Params = { slug: string };

export default async function Page({ params }: { params: Params }) {
  const { slug } = params;
  console.log("Resolved Params:", slug);

  const supabase = await createClient();
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", slug);

  if (error) {
    console.error(error);
    return <div>Error loading lesson data.</div>;
  }

  if (!lessons || lessons.length === 0) {
    return <div>No lesson found.</div>;
  }

  const lesson = lessons[0];

  return (
    <div>
      <p>Student: {getUsername(lesson.student_id)}</p>
      <p>Teacher: {getUsername(lesson.teacher_id)}</p>
      <p>Created At: {new Date(lesson.created_at).toLocaleString()}</p>
      <p>Updated At: {new Date(lesson.updated_at).toLocaleString()}</p>
      <p>Date: {new Date(lesson.date).toLocaleDateString()}</p>
      <p>Hour Date: {new Date(lesson.hour_date).toLocaleString()}</p>
      <p>Notes: {lesson.notes}</p>
      <div>
        <h3>Songs:</h3>

        {!lesson.songs && <p>No songs found.</p>}

        {lesson.songs && (
          <ul>
            {lesson.songs.map((song: Song) => (
              <li key={song.id}>{song.title}</li>
            ))}
          </ul>
        )}
      </div>
      <Link href={`/dashboard/lessons/${lesson.id}/edit`}>Edit Lesson</Link>
    </div>
  );
}
