import { createClient } from "@/utils/supabase/clients/server"

export default async function Page() {
    const supabase = await createClient()
    const { data: lessons, error } = await supabase.from('lessons').select('*')

    if (error) {
        console.error(error)
        return <div>Error loading lessons</div>
    }

    console.log(lessons)
    return (
        <div>
            {lessons.map((lesson: any) => (
                <div key={lesson.id}>
                    <h2>Lesson ID: {lesson.id}</h2>
                    <p>Student ID: {lesson.student_id}</p>
                    <p>Teacher ID: {lesson.teacher_id}</p>
                    <p>Created: {lesson.created_at}</p>
                    <p>Updated: {lesson.updated_at}</p>

                </div>
            ))}
        </div>
    )

}
