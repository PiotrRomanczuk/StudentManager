import { Song } from "@/types/Song";

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