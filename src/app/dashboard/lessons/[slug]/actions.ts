import { createClient } from "@/utils/supabase/clients/server";

export async function deleteLesson(lessonId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
    if (error) {
        throw new Error(error.message);
    }
}

