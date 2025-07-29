import { getLessonById } from "../lesson-api-helpers";

export async function fetchLessonData(slug: string, cookieHeader: string) {
  try {
    const lesson = await getLessonById(slug, cookieHeader);
    return lesson;
  } catch (error) {
    console.error("Error fetching lesson data:", error);
    return null;
  }
} 