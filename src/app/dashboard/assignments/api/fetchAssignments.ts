import { BASE_URL } from "@/constants/BASE_URL";

export async function fetchAssignmentsData(
  userId?: string,
  sort?: string,
  filter?: string,
  cookieHeader?: string
) {
  const url = new URL(`${BASE_URL}/api/assignments`);
  
  if (userId) url.searchParams.append("userId", userId);
  if (sort) url.searchParams.append("sort", sort);
  if (filter) url.searchParams.append("filter", filter);

  const assignments_res = await fetch(url.toString(), {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });

  if (!assignments_res.ok) {
    throw new Error(
      (await assignments_res.json()).error || "Failed to fetch assignments"
    );
  }

  return assignments_res.json();
}

export async function fetchAssignmentData(assignmentId: string, cookieHeader?: string) {
  const assignments_res = await fetch(`${BASE_URL}/api/assignments/${assignmentId}`, {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });

  if (!assignments_res.ok) {
    if (assignments_res.status === 404) {
      return null;
    }
    throw new Error(
      (await assignments_res.json()).error || "Failed to fetch assignment"
    );
  }

  return assignments_res.json();
} 