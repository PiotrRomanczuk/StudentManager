import '@testing-library/jest-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSongApi } from '@/app/dashboard/tdd-songs/hooks/useSongApi';
import * as songApiHelpers from '@/utils/song-api-helpers';

// Mock the song API helpers
jest.mock('@/utils/song-api-helpers');
const mockSongApiHelpers = songApiHelpers as jest.Mocked<typeof songApiHelpers>;

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('useSongApi', () => {
  const mockSongs = [
    {
      id: '1',
      title: 'Test Song 1',
      author: 'Test Author',
      level: 'Beginner',
      key: 'C',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Test Song 2',
      author: 'Test Author 2',
      level: 'Intermediate',
      key: 'G',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ];

  const mockPagination = {
    page: 1,
    limit: 50,
    total: 103,
    totalPages: 3,
  };

  const mockApiResponse = {
    songs: mockSongs,
    pagination: mockPagination,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      expect(result.current.songs).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      });
    });

    it('should auto-fetch songs when autoFetch is true', async () => {
      mockSongApiHelpers.getAllSongs.mockResolvedValue(mockApiResponse);

      renderHook(() => useSongApi({ userId: 'user123', isAdmin: true, autoFetch: true }));

      await waitFor(() => {
        expect(mockSongApiHelpers.getAllSongs).toHaveBeenCalled();
      });
    });

    it('should not auto-fetch when autoFetch is false', () => {
      renderHook(() => useSongApi({ userId: 'user123', isAdmin: true, autoFetch: false }));

      expect(mockSongApiHelpers.getAllSongs).not.toHaveBeenCalled();
    });
  });

  describe('fetchAllSongs', () => {
    it('should fetch all songs successfully for admin user', async () => {
      mockSongApiHelpers.getAllSongs.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.fetchAllSongs({
          page: 1,
          limit: 50,
          search: 'test',
          sortBy: 'created_at',
          sortOrder: 'desc',
        });
      });

      expect(mockSongApiHelpers.getAllSongs).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        search: 'test',
        sortBy: 'created_at',
        sortOrder: 'desc',
      });
      expect(result.current.songs).toEqual(mockSongs);
      expect(result.current.pagination).toEqual(mockPagination);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should show error for non-admin users', async () => {
      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: false }));

      await act(async () => {
        await result.current.fetchAllSongs();
      });

      expect(mockSongApiHelpers.getAllSongs).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockSongApiHelpers.getAllSongs.mockRejectedValue(error);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.fetchAllSongs();
      });

      expect(result.current.error).toBe('API Error');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('fetchUserSongs', () => {
    it('should fetch user songs successfully', async () => {
      mockSongApiHelpers.getUserSongs.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: false }));

      await act(async () => {
        await result.current.fetchUserSongs();
      });

      expect(mockSongApiHelpers.getUserSongs).toHaveBeenCalledWith('user123');
      expect(result.current.songs).toEqual(mockSongs);
      expect(result.current.pagination).toEqual(mockPagination);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockSongApiHelpers.getUserSongs.mockRejectedValue(error);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: false }));

      await act(async () => {
        await result.current.fetchUserSongs();
      });

      expect(result.current.error).toBe('API Error');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('searchSongsWithFilters', () => {
    it('should search songs with filters successfully', async () => {
      mockSongApiHelpers.searchSongs.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.searchSongsWithFilters({
          q: 'test',
          level: 'Beginner',
          key: 'C',
          page: 1,
          limit: 25,
        });
      });

      expect(mockSongApiHelpers.searchSongs).toHaveBeenCalledWith({
        q: 'test',
        level: 'Beginner',
        key: 'C',
        page: 1,
        limit: 25,
      });
      expect(result.current.songs).toEqual(mockSongs);
      expect(result.current.pagination).toEqual(mockPagination);
    });
  });

  describe('createNewSong', () => {
    it('should create a new song successfully', async () => {
      const newSong = { ...mockSongs[0], id: '3', title: 'New Song' };
      mockSongApiHelpers.createSong.mockResolvedValue(newSong);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      // Set initial songs
      act(() => {
        result.current.songs = mockSongs;
      });

      await act(async () => {
        await result.current.createNewSong({
          title: 'New Song',
          author: 'New Author',
        });
      });

      expect(mockSongApiHelpers.createSong).toHaveBeenCalledWith({
        title: 'New Song',
        author: 'New Author',
      });
      expect(result.current.songs).toHaveLength(3);
      expect(result.current.songs[0]).toEqual(newSong);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      mockSongApiHelpers.createSong.mockRejectedValue(error);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await expect(async () => {
        await act(async () => {
          await result.current.createNewSong({ title: 'New Song' });
        });
      }).rejects.toThrow('Creation failed');
    });
  });

  describe('updateExistingSong', () => {
    it('should update a song successfully', async () => {
      const updatedSong = { ...mockSongs[0], title: 'Updated Song' };
      mockSongApiHelpers.updateSong.mockResolvedValue(updatedSong);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      // Set initial songs
      act(() => {
        result.current.songs = mockSongs;
      });

      await act(async () => {
        await result.current.updateExistingSong('1', { title: 'Updated Song' });
      });

      expect(mockSongApiHelpers.updateSong).toHaveBeenCalledWith('1', { title: 'Updated Song' });
      expect(result.current.songs[0]).toEqual(updatedSong);
    });
  });

  describe('deleteExistingSong', () => {
    it('should delete a song successfully', async () => {
      mockSongApiHelpers.deleteSong.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      // Set initial songs
      act(() => {
        result.current.songs = mockSongs;
      });

      await act(async () => {
        await result.current.deleteExistingSong('1');
      });

      expect(mockSongApiHelpers.deleteSong).toHaveBeenCalledWith('1');
      expect(result.current.songs).toHaveLength(1);
      expect(result.current.songs[0].id).toBe('2');
    });
  });

  describe('Favorites Management', () => {
    it('should fetch user favorites', async () => {
      const mockFavorites = {
        favorites: [{ id: '1', user_id: 'user123', song_id: '1', created_at: '2024-01-01T00:00:00Z', song: mockSongs[0] }],
        total: 1,
      };
      mockSongApiHelpers.getUserFavorites.mockResolvedValue(mockFavorites);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.fetchUserFavorites();
      });

      expect(mockSongApiHelpers.getUserFavorites).toHaveBeenCalledWith('user123');
      expect(result.current.favorites).toEqual(mockFavorites);
    });

    it('should add song to favorites', async () => {
      mockSongApiHelpers.addToFavorites.mockResolvedValue({});
      mockSongApiHelpers.getUserFavorites.mockResolvedValue({ favorites: [], total: 0 });

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.addSongToFavorites('1');
      });

      expect(mockSongApiHelpers.addToFavorites).toHaveBeenCalledWith('user123', '1');
      expect(mockSongApiHelpers.getUserFavorites).toHaveBeenCalledWith('user123');
    });

    it('should remove song from favorites', async () => {
      mockSongApiHelpers.removeFromFavorites.mockResolvedValue({ success: true });
      mockSongApiHelpers.getUserFavorites.mockResolvedValue({ favorites: [], total: 0 });

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.removeSongFromFavorites('1');
      });

      expect(mockSongApiHelpers.removeFromFavorites).toHaveBeenCalledWith('user123', '1');
      expect(mockSongApiHelpers.getUserFavorites).toHaveBeenCalledWith('user123');
    });
  });

  describe('Bulk Operations', () => {
    it('should import songs in bulk', async () => {
      const mockBulkResult = {
        results: [
          { title: 'Song 1', status: 'created' as const, data: mockSongs[0] },
          { title: 'Song 2', status: 'updated' as const, data: mockSongs[1] },
        ],
        summary: { total: 2, success: 2, error: 0 },
      };
      mockSongApiHelpers.bulkImportSongs.mockResolvedValue(mockBulkResult);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.importSongsBulk([{ title: 'Song 1' }, { title: 'Song 2' }]);
      });

      expect(mockSongApiHelpers.bulkImportSongs).toHaveBeenCalledWith(
        [{ title: 'Song 1' }, { title: 'Song 2' }],
        undefined
      );
    });

    it('should delete songs in bulk', async () => {
      mockSongApiHelpers.bulkDeleteSongs.mockResolvedValue({ success: true, deleted_count: 2 });

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.bulkDeleteSongs(['1', '2']);
      });

      expect(mockSongApiHelpers.bulkDeleteSongs).toHaveBeenCalledWith(['1', '2']);
    });
  });

  describe('Export and Stats', () => {
    it('should export songs', async () => {
      const mockResponse = new Response('exported data');
      mockSongApiHelpers.exportSongs.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.exportSongs({ format: 'json' });
      });

      expect(mockSongApiHelpers.exportSongs).toHaveBeenCalledWith({ format: 'json' });
    });

    it('should get song stats', async () => {
      const mockStats = {
        total_songs: 103,
        songs_by_level: { Beginner: 50, Intermediate: 53 },
        songs_by_key: { C: 30, G: 40 },
        songs_with_audio: 80,
        songs_with_chords: 90,
        top_authors: [{ author: 'Test Author', count: 10 }],
        average_songs_per_author: 5.15,
        recent_songs: 20,
        songs_without_audio: 23,
        songs_without_chords: 13,
      };
      mockSongApiHelpers.getSongStats.mockResolvedValue(mockStats);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.getSongStats();
      });

      expect(mockSongApiHelpers.getSongStats).toHaveBeenCalled();
      expect(result.current.stats).toEqual(mockStats);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors with proper error messages', async () => {
      const error = new Error('Network error');
      mockSongApiHelpers.getAllSongs.mockRejectedValue(error);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      await act(async () => {
        await result.current.fetchAllSongs();
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.loading).toBe(false);
    });

    it('should clear error when new request is made', async () => {
      // First request fails
      mockSongApiHelpers.getAllSongs.mockRejectedValueOnce(new Error('First error'));
      // Second request succeeds
      mockSongApiHelpers.getAllSongs.mockResolvedValueOnce(mockApiResponse);

      const { result } = renderHook(() => useSongApi({ userId: 'user123', isAdmin: true }));

      // First request
      await act(async () => {
        await result.current.fetchAllSongs();
      });

      expect(result.current.error).toBe('First error');

      // Second request
      await act(async () => {
        await result.current.fetchAllSongs();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.songs).toEqual(mockSongs);
    });
  });
}); 