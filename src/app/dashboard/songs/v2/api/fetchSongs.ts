import { BASE_URL } from "@/constants/BASE_URL";

export async function fetchSongsData(userId: string | undefined, cookieHeader: string) {
  const url = new URL(`${BASE_URL}/api/song/user-songs`);
  if (userId) url.searchParams.append('userId', userId);

  const songs_res = await fetch(url.toString(), {
    cache: "no-store",
    headers: { Cookie: cookieHeader },
  });
  
  if (!songs_res.ok) {
    throw new Error((await songs_res.json()).error || "Failed to fetch songs");
  }
  
  return songs_res.json();
} 