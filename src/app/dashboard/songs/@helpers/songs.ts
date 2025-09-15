import { BASE_URL } from "@/constants/BASE_URL";
import { fetchApi } from "../../../../utils/api-helpers";
import { Song } from "@/types/Song";
import { SongsResponse } from "./types";

/**
 * Get all songs (admin only)
 */
export async function getAllSongs(params?: {
  level?: string;
  key?: string;
  author?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  cookieHeader?: string;
}): Promise<SongsResponse> {
  const url = new URL(`${BASE_URL}/api/song`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && key !== "cookieHeader") {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  const options: RequestInit = {};
  if (params?.cookieHeader) {
    options.headers = { Cookie: params.cookieHeader };
  }
  return fetchApi<SongsResponse>(url.toString(), options);
}

/**
 * Get songs for a specific user
 */
export async function getUserSongs(userId?: string): Promise<SongsResponse> {
  const url = new URL(`${BASE_URL}/api/song/user-songs`);
  if (userId) url.searchParams.append("userId", userId);
  return fetchApi<SongsResponse>(url.toString());
}

/**
 * Get songs for a specific student
 */
export async function getStudentSongs(studentId: string): Promise<{ songs: Song[]; total: number }> {
  const url = new URL(`${BASE_URL}/api/song/student-songs`);
  url.searchParams.append("studentId", studentId);
  return fetchApi<{ songs: Song[]; total: number }>(url.toString());
}

/**
 * Get a single song by ID
 */
export async function getSongById(songId: string, cookieHeader?: string): Promise<Song> {
  const url = `${BASE_URL}/api/song/${songId}`;
  const options: RequestInit = {};
  if (cookieHeader) options.headers = { Cookie: cookieHeader };
  return fetchApi<Song>(url, options);
}

/**
 * Create a new song
 */
export async function createSong(songData: Partial<Song>, cookieHeader?: string): Promise<Song> {
  const url = `${BASE_URL}/api/song/create`;
  const options: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(songData),
  };
  if (cookieHeader) options.headers = { ...options.headers, Cookie: cookieHeader };
  return fetchApi<Song>(url, options);
}

/**
 * Update an existing song
 */
export async function updateSong(songId: string, songData: Partial<Song>, cookieHeader?: string): Promise<Song> {
  const url = `${BASE_URL}/api/song/update/${songId}`;
  const options: RequestInit = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(songData),
  };
  if (cookieHeader) options.headers = { ...options.headers, Cookie: cookieHeader };
  return fetchApi<Song>(url, options);
}

/**
 * Delete a song
 */
export async function deleteSong(songId: string, cookieHeader?: string): Promise<{ success: boolean }> {
  const url = new URL(`${BASE_URL}/api/song/delete`);
  url.searchParams.append("id", songId);
  const options: RequestInit = { method: "DELETE" };
  if (cookieHeader) options.headers = { Cookie: cookieHeader };
  return fetchApi<{ success: boolean }>(url.toString(), options);
}

/**
 * Search songs with filters
 */
export async function searchSongs(params: {
  q?: string;
  level?: string;
  key?: string;
  author?: string;
  hasAudio?: boolean;
  hasChords?: boolean;
  page?: number;
  limit?: number;
}): Promise<SongsResponse> {
  const url = new URL(`${BASE_URL}/api/song/search`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, value.toString());
  });
  return fetchApi<SongsResponse>(url.toString());
}

/**
 * Get filter options (all unique levels, keys, authors)
 */
export async function getFilterOptions(cookieHeader?: string): Promise<{
  levels: string[];
  keys: string[];
  authors: string[];
}> {
  const url = `${BASE_URL}/api/song/filter-options`;
  const options: RequestInit = {};
  if (cookieHeader) options.headers = { Cookie: cookieHeader };
  return fetchApi<{ levels: string[]; keys: string[]; authors: string[] }>(url, options);
}

/**
 * Get user test songs
 */
export async function getUserTestSongs(userId: string): Promise<Song[]> {
  const url = new URL(`${BASE_URL}/api/song/user-test-song`);
  url.searchParams.append("userId", userId);
  return fetchApi<Song[]>(url.toString());
}

/**
 * Get students who have a specific song
 */
export async function getStudentsBySong(songId: string): Promise<{
  students: Array<{
    student_id: string;
    song_status: string;
    student: { user_id: string; email: string; firstName: string; lastName: string };
    lessons: Array<{ lesson_id: string; title: string; date: string; status: string }>;
  }>;
  total: number;
}> {
  const url = new URL(`${BASE_URL}/api/song/students-by-song`);
  url.searchParams.append("songId", songId);
  return fetchApi<{
    students: Array<{
      student_id: string;
      song_status: string;
      student: { user_id: string; email: string; firstName: string; lastName: string };
      lessons: Array<{ lesson_id: string; title: string; date: string; status: string }>;
    }>;
    total: number;
  }>(url.toString());
}