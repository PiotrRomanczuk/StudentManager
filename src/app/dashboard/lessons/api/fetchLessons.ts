import { BASE_URL } from "@/constants/BASE_URL";

export async function fetchLessonsData(
  userId?: string,
  sort?: string,
  filter?: string,
  cookieHeader?: string
) {
  const url = new URL(`${BASE_URL}/api/lessons`);
  
  if (userId) url.searchParams.append("userId", userId);
  if (sort) url.searchParams.append("sort", sort);
  if (filter) url.searchParams.append("filter", filter);

  const lessons_res = await fetch(url.toString(), {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });

  if (!lessons_res.ok) {
    throw new Error(
      (await lessons_res.json()).error || "Failed to fetch lessons"
    );
  }

  return lessons_res.json();
}

export async function fetchLessonData(lessonId: string, cookieHeader?: string) {
  const lessons_res = await fetch(`${BASE_URL}/api/lessons/${lessonId}`, {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });

  if (!lessons_res.ok) {
    if (lessons_res.status === 404) {
      return null;
    }
    throw new Error(
      (await lessons_res.json()).error || "Failed to fetch lesson"
    );
  }

  return lessons_res.json();
}