import { BASE_URL } from "@/constants/BASE_URL";

export async function getSongsForUser(cookieHeader: string) {
  const response = await fetch(`${BASE_URL}/api/songs`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });
  const data = await response.json();
  return { response, data };
}
