import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getAllSongs,
  getUserSongs,
  createSong,
  updateSong,
  deleteSong,
  searchSongs,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  bulkImportSongs,
  bulkDeleteSongs,
  exportSongs,
  getSongStats,
  getStudentSongs,
  getUserTestSongs,
  getAdminFavorites,
  getAdminUserSongs,
  handleSongApiError,
  type FavoritesResponse,
  type SongStats,
  type BulkImportResult,
  type ValidationResult
} from '../song-api-helpers';
import { Song } from '@/types/Song';

interface UseSongApiOptions {
  userId?: string;
  isAdmin?: boolean;
  autoFetch?: boolean;
}

export function useSongApi(options: UseSongApiOptions = {}) {
  const { userId, isAdmin = false, autoFetch = true } = options;
  
  // State management
  const [songs, setSongs] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<FavoritesResponse | null>(null);
  const [stats, setStats] = useState<SongStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Fetch all songs (admin only)
  const fetchAllSongs = useCallback(async (params?: {
    level?: string;
    key?: string;
    author?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    if (!isAdmin) {
      toast.error("You don't have permission to view all songs");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getAllSongs(params);
      setSongs(response.songs || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Fetch user songs
  const fetchUserSongs = useCallback(async (targetUserId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserSongs(targetUserId || userId);
      const convertedSongs = (response.songs || []).map(convertApiSongToLocalSong);
      setSongs(convertedSongs);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Search songs
  const searchSongsWithFilters = useCallback(async (params: {
    q?: string;
    level?: string;
    key?: string;
    author?: string;
    hasAudio?: boolean;
    hasChords?: boolean;
    page?: number;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchSongs(params);
      const convertedSongs = (response.songs || []).map(convertApiSongToLocalSong);
      setSongs(convertedSongs);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create song
  const createNewSong = useCallback(async (songData: Partial<Song>) => {
    try {
      setLoading(true);
      setError(null);
      const newSong = await createSong(songData);
      setSongs(prev => [newSong, ...prev]);
      toast.success(`Song "${newSong.title}" created successfully`);
      return newSong;
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update song
  const updateExistingSong = useCallback(async (songId: string, updates: Partial<Song>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedSong = await updateSong(songId, updates);
      setSongs(prev => prev.map(song => song.id === songId ? updatedSong : song));
      toast.success(`Song "${updatedSong.title}" updated successfully`);
      return updatedSong;
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete song
  const deleteExistingSong = useCallback(async (songId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await deleteSong(songId);
      if (result.success) {
        setSongs(prev => prev.filter(song => song.id !== songId));
        toast.success("Song deleted successfully");
      }
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Favorites management
  const fetchUserFavorites = useCallback(async (targetUserId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserFavorites(targetUserId || userId!);
      setFavorites(response);
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addSongToFavorites = useCallback(async (songId: string, targetUserId?: string) => {
    try {
      setLoading(true);
      setError(null);
      await addToFavorites(targetUserId || userId!, songId);
      await fetchUserFavorites(targetUserId);
      toast.success("Song added to favorites");
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchUserFavorites]);

  const removeSongFromFavorites = useCallback(async (songId: string, targetUserId?: string) => {
    try {
      setLoading(true);
      setError(null);
      await removeFromFavorites(targetUserId || userId!, songId);
      await fetchUserFavorites(targetUserId);
      toast.success("Song removed from favorites");
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchUserFavorites]);

  // Bulk operations
  const importSongsBulk = useCallback(async (songs: Partial<Song>[], options?: {
    overwrite?: boolean;
    validate_only?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bulkImportSongs(songs, options);
      
      if ('validation_results' in result) {
        // Validation result
        const validation = result as ValidationResult;
        const validCount = validation.summary.valid;
        const invalidCount = validation.summary.invalid;
        
        if (invalidCount > 0) {
          toast.warning(`${validCount} songs valid, ${invalidCount} songs invalid`);
        } else {
          toast.success(`All ${validCount} songs are valid`);
        }
      } else {
        // Import result
        const importResult = result as BulkImportResult;
        const successCount = importResult.summary.success;
        const errorCount = importResult.summary.error;
        
        if (errorCount > 0) {
          toast.warning(`Imported ${successCount} songs, ${errorCount} failed`);
        } else {
          toast.success(`Successfully imported ${successCount} songs`);
        }
        
        // Refresh songs list if not validation only
        if (!options?.validate_only) {
          await fetchUserSongs();
        }
      }
      
      return result;
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserSongs]);

  const deleteSongsBulk = useCallback(async (songIds: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await bulkDeleteSongs(songIds);
      setSongs(prev => prev.filter(song => !songIds.includes(song.id)));
      toast.success(`Deleted ${result.deleted_count} songs`);
      return result;
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Export songs
  const exportSongsData = useCallback(async (params: {
    format?: "json" | "csv" | "pdf";
    level?: string;
    key?: string;
    author?: string;
    includeLessons?: boolean;
    includeAudioUrls?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await exportSongs(params);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `songs.${params.format || 'json'}`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Songs exported successfully");
      } else {
        throw new Error("Export failed");
      }
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get statistics
  const fetchSongStats = useCallback(async () => {
    if (!isAdmin) {
      toast.error("You don't have permission to view statistics");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const statsData = await getSongStats();
      setStats(statsData);
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Student-specific operations
  const fetchStudentSongs = useCallback(async (studentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudentSongs(studentId);
      setSongs(response.songs || []);
      setPagination({ page: 1, limit: 20, total: response.total, totalPages: Math.ceil(response.total / 20) });
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserTestSongs = useCallback(async (targetUserId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const songs = await getUserTestSongs(targetUserId || userId!);
      setSongs(songs || []);
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Admin operations
  const fetchAdminFavorites = useCallback(async (targetUserId: string) => {
    if (!isAdmin) {
      toast.error("You don't have permission to view admin favorites");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const favorites = await getAdminFavorites(targetUserId);
      setSongs(favorites || []);
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchAdminUserSongs = useCallback(async (targetUserId: string) => {
    if (!isAdmin || !userId) {
      toast.error("You don't have permission to view user songs");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const songs = await getAdminUserSongs(userId, targetUserId);
      setSongs(songs || []);
    } catch (err) {
      const errorMessage = handleSongApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, userId]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && userId) {
      if (isAdmin) {
        fetchAllSongs();
      } else {
        fetchUserSongs();
      }
    }
  }, [autoFetch, userId, isAdmin, fetchAllSongs, fetchUserSongs]);

  return {
    // State
    songs,
    favorites,
    stats,
    loading,
    error,
    pagination,
    
    // Actions
    fetchAllSongs,
    fetchUserSongs,
    searchSongsWithFilters,
    createNewSong,
    updateExistingSong,
    deleteExistingSong,
    fetchUserFavorites,
    addSongToFavorites,
    removeSongFromFavorites,
    importSongsBulk,
    deleteSongsBulk,
    exportSongsData,
    fetchSongStats,
    fetchStudentSongs,
    fetchUserTestSongs,
    fetchAdminFavorites,
    fetchAdminUserSongs,
    
    // Utilities
    clearError: () => setError(null),
    refresh: () => {
      if (isAdmin) {
        fetchAllSongs();
      } else {
        fetchUserSongs();
      }
    }
  };
} 