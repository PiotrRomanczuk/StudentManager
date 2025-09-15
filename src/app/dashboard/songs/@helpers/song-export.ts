import { BASE_URL } from "@/constants/BASE_URL";

/**
 * Export songs
 */
export async function exportSongs(params: {
  format?: "json" | "csv" | "pdf";
  level?: string;
  key?: string;
  author?: string;
  includeLessons?: boolean;
  includeAudioUrls?: boolean;
}): Promise<Response> {
  const url = new URL(`${BASE_URL}/api/song/export`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, value.toString());
  });
  return fetch(url.toString());
}