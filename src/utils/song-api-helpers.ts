import { BASE_URL } from "@/constants/BASE_URL";
import { fetchApi, APIError } from "./api-helpers";

// Types for API responses
export interface Song {
  id: string;
  title: string;
  author?: string;
  level?: string;
  key?: string;
  chords?: string;
  audio_files?: string[];
  ultimate_guitar_link?: string;
  short_title?: string;
  created_at: string;
  updated_at: string;
  status?: string; // For songs with status (from lessons)
}

export interface SongWithStatus extends Song {
  status: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SongsResponse {
  songs: Song[];
  pagination?: PaginationInfo;
  filters?: Record<string, any>;
}

export interface FavoritesResponse {
  favorites: Array<{
    id: string;
    user_id: string;
    song_id: string;
    created_at: string;
    song: Song;
  }>;
  total: number;
}

export interface BulkImportResult {
  results: Array<{
    title: string;
    status: "created" | "updated" | "skipped" | "error";
    reason?: string;
    error?: string;
    data?: Song;
  }>;
  summary: {
    total: number;
    success: number;
    error: number;
  };
}

export interface ValidationResult {
  validation_results: Array<{
    index: number;
    valid: boolean;
    errors?: any[];
  }>;
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
}

export interface SongStats {
  total_songs: number;
  songs_by_level: Record<string, number>;
  songs_by_key: Record<string, number>;
  songs_with_audio: number;
  songs_with_chords: number;
  top_authors: Array<{ author: string; count: number }>;
  average_songs_per_author: number;
  recent_songs: number;
  songs_without_audio: number;
  songs_without_chords: number;
}

// API Helper Functions

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
}): Promise<SongsResponse> {
  const url = new URL(`${BASE_URL}/api/song`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return fetchApi<SongsResponse>(url.toString());
}

/**
 * Get songs for a specific user
 */
export async function getUserSongs(userId?: string): Promise<SongsResponse> {
  const url = new URL(`${BASE_URL}/api/song/user-songs`);
  if (userId) {
    url.searchParams.append("userId", userId);
  }

  return fetchApi<SongsResponse>(url.toString());
}

/**
 * Get songs for a specific student
 */
export async function getStudentSongs(studentId: string): Promise<{ songs: SongWithStatus[]; total: number }> {
  const url = new URL(`${BASE_URL}/api/song/student-songs`);
  url.searchParams.append("studentId", studentId);

  return fetchApi<{ songs: SongWithStatus[]; total: number }>(url.toString());
}

/**
 * Get a single song by ID
 */
export async function getSongById(songId: string): Promise<Song> {
  const url = `${BASE_URL}/api/song/${songId}`;
  return fetchApi<Song>(url);
}

/**
 * Create a new song
 */
export async function createSong(songData: Partial<Song>): Promise<Song> {
  const url = `${BASE_URL}/api/song`;
  
  return fetchApi<Song>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(songData),
  });
}

/**
 * Update an existing song
 */
export async function updateSong(songId: string, songData: Partial<Song>): Promise<Song> {
  const url = `${BASE_URL}/api/song?id=${songId}`;
  
  return fetchApi<Song>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(songData),
  });
}

/**
 * Delete a song
 */
export async function deleteSong(songId: string): Promise<{ success: boolean }> {
  const url = `${BASE_URL}/api/song?id=${songId}`;
  
  return fetchApi<{ success: boolean }>(url, {
    method: "DELETE",
  });
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
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  return fetchApi<SongsResponse>(url.toString());
}

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
export async function addToFavorites(userId: string, songId: string): Promise<any> {
  const url = `${BASE_URL}/api/song/favorites`;
  
  return fetchApi<any>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

  return fetchApi<{ success: boolean }>(url.toString(), {
    method: "DELETE",
  });
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

/**
 * Bulk import songs
 */
export async function bulkImportSongs(songs: Partial<Song>[], options?: {
  overwrite?: boolean;
  validate_only?: boolean;
}): Promise<BulkImportResult | ValidationResult> {
  const url = `${BASE_URL}/api/song/bulk`;
  
  return fetchApi<BulkImportResult | ValidationResult>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      songs,
      overwrite: options?.overwrite || false,
      validate_only: options?.validate_only || false,
    }),
  });
}

/**
 * Bulk delete songs (admin only)
 */
export async function bulkDeleteSongs(songIds: string[]): Promise<{ success: boolean; deleted_count: number }> {
  const url = new URL(`${BASE_URL}/api/song/bulk`);
  url.searchParams.append("ids", songIds.join(","));

  return fetchApi<{ success: boolean; deleted_count: number }>(url.toString(), {
    method: "DELETE",
  });
}

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
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  return fetch(url.toString());
}

/**
 * Get song statistics (admin only)
 */
export async function getSongStats(): Promise<SongStats> {
  const url = `${BASE_URL}/api/song/stats`;
  return fetchApi<SongStats>(url);
}

/**
 * Get user test songs
 */
export async function getUserTestSongs(userId: string): Promise<SongWithStatus[]> {
  const url = new URL(`${BASE_URL}/api/song/user-test-song`);
  url.searchParams.append("userId", userId);

  return fetchApi<SongWithStatus[]>(url.toString());
}

// Error handling utilities
export function handleSongApiError(error: unknown): string {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        return "You are not authorized to perform this action";
      case 403:
        return "You don't have permission to access this resource";
      case 404:
        return "Song not found";
      case 409:
        return "Song already exists";
      default:
        return error.message || "An error occurred";
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred";
} 