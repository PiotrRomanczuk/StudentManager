import { BASE_URL } from "@/constants/BASE_URL";
import { fetchApi } from "../../../../utils/api-helpers";
import { SongStats } from "./types";

/**
 * Get song statistics (admin only)
 */
export async function getSongStats(): Promise<SongStats> {
  const url = `${BASE_URL}/api/song/stats`;
  return fetchApi<SongStats>(url);
}