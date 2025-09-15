import { BASE_URL } from "@/constants/BASE_URL";
import { fetchApi } from "../../../../utils/api-helpers";
import { Song } from "@/types/Song";
import { FavoritesResponse } from "./types";

/**
 * Get user favorites
 */
export async function getUserFavorites(userId: string): Promise<FavoritesResponse> {
  const url = new URL(`${BASE_URL}/api/song/favorites`);
  url.searchParams.append("userId", userId);
  return fetchApi<FavoritesResponse>(url.toString());
}

/**
 * Add a song to favorites
 */
export async function addToFavorites(userId: string, songId: string): Promise<unknown> {
  const url = `${BASE_URL}/api/song/favorites`;
  return fetchApi<unknown>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, song_id: songId }),
  });
}

/**
 * Remove a song from favorites
 */
export async function removeFromFavorites(userId: string, songId: string): Promise<{ success: boolean }> {
  const url = new URL(`${BASE_URL}/api/song/favorites`);
  url.searchParams.append("userId", userId);
  url.searchParams.append("songId", songId);
  return fetchApi<{ success: boolean }>(url.toString(), { method: "DELETE" });
}

/**
 * Get admin favorites (admin only)
 */
export async function getAdminFavorites(userId: string): Promise<Song[]> {
  const url = new URL(`${BASE_URL}/api/song/admin-favorites`);
  url.searchParams.append("userId", userId);
  return fetchApi<Song[]>(url.toString());
}

/**
 * Get admin songs for a specific user (admin only)
 */
export async function getAdminUserSongs(currentUserId: string, targetUserId: string): Promise<Song[]> {
  const url = new URL(`${BASE_URL}/api/song/admin-songs`);
  url.searchParams.append("currentUserId", currentUserId);
  url.searchParams.append("targetUserId", targetUserId);
  return fetchApi<Song[]>(url.toString());
}