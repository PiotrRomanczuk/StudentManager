import { BASE_URL } from "@/constants/BASE_URL";
import { fetchApi, APIError } from "../../../utils/api-helpers";
import { Song } from "@/types/Song";

// Types for API responses
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SongsResponse {
  songs: Song[];
  pagination?: PaginationInfo;
  filters?: Record<string, unknown>;
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
    errors?: unknown[];
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
  cookieHeader?: string;
}): Promise<SongsResponse> {
  const url = new URL(`${BASE_URL}/api/song`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && key !== 'cookieHeader') {
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
  if (userId) {
    url.searchParams.append("userId", userId);
  }

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
  if (cookieHeader) {
    options.headers = { Cookie: cookieHeader };
  }
  
  return fetchApi<Song>(url, options);
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
export async function addToFavorites(userId: string, songId: string): Promise<unknown> {
  const url = `${BASE_URL}/api/song/favorites`;
  
  return fetchApi<unknown>(url, {
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
export async function getUserTestSongs(userId: string): Promise<Song[]> {
  const url = new URL(`${BASE_URL}/api/song/user-test-song`);
  url.searchParams.append("userId", userId);

  return fetchApi<Song[]>(url.toString());
}

// Error handling utilities
export function handleSongApiError(error: unknown): string {
  console.error("Song API Error:", error);
  
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        return "You are not authorized to perform this action. Please log in again.";
      case 403:
        return "You don't have permission to access this resource. Contact your administrator.";
      case 404:
        return "Song not found or API endpoint not available.";
      case 409:
        return "Song already exists with the same title and author.";
      case 500:
        return "Server error. Please try again later or contact support.";
      case 503:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return error.message || `API Error (${error.status}): An error occurred`;
    }
  }
  
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes("Supabase environment variables")) {
      return "Database configuration error. Please check your environment setup.";
    }
    if (error.message.includes("Network error")) {
      return "Network connection error. Please check your internet connection.";
    }
    if (error.message.includes("fetch")) {
      return "Failed to connect to the server. Please try again.";
    }
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again or contact support.";
} 