import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import TddSongsClient from '@/app/dashboard/tdd-songs/components/TddSongsClient';
import { useSongApi } from '@/app/dashboard/tdd-songs/hooks/useSongApi';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock the useSongApi hook
jest.mock('@/app/dashboard/tdd-songs/hooks/useSongApi');

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;
const mockUseSongApi = useSongApi as jest.MockedFunction<typeof useSongApi>;

describe('TddSongsClient', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  const mockSearchParams = new URLSearchParams('page=1&limit=50');

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

  const mockFetchAllSongs = jest.fn();
  const mockFetchUserSongs = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseSearchParams.mockReturnValue(mockSearchParams);
    
    mockUseSongApi.mockReturnValue({
      songs: mockSongs,
      loading: false,
      error: null,
      fetchAllSongs: mockFetchAllSongs,
      fetchUserSongs: mockFetchUserSongs,
      pagination: mockPagination,
      favorites: null,
      stats: null,
      createNewSong: jest.fn(),
      updateExistingSong: jest.fn(),
      deleteExistingSong: jest.fn(),
      fetchUserFavorites: jest.fn(),
      addSongToFavorites: jest.fn(),
      removeSongFromFavorites: jest.fn(),
      searchSongsWithFilters: jest.fn(),
      importSongsBulk: jest.fn(),
      bulkDeleteSongs: jest.fn(),
      exportSongs: jest.fn(),
      getSongStats: jest.fn(),
      getStudentSongs: jest.fn(),
      getUserTestSongs: jest.fn(),
      getAdminFavorites: jest.fn(),
      getAdminUserSongs: jest.fn(),
    });
  });

  describe('Rendering', () => {
    it('should render the component with correct title and user info', () => {
      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
          initialPage={1}
          initialLimit={50}
        />
      );

      expect(screen.getByText('TDD Songs Table')).toBeInTheDocument();
      expect(screen.getByText(/User: user123/)).toBeInTheDocument();
      expect(screen.getByText(/Admin: Yes/)).toBeInTheDocument();
    });

    it('should show correct song count and page info', () => {
      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
          initialPage={1}
          initialLimit={50}
        />
      );

      expect(screen.getByText('Total songs loaded: 2 (Page 1)')).toBeInTheDocument();
      expect(screen.getByText('Total songs in database: 103')).toBeInTheDocument();
    });

    it('should show loading state', () => {
      mockUseSongApi.mockReturnValue({
        songs: [],
        loading: true,
        error: null,
        fetchAllSongs: mockFetchAllSongs,
        fetchUserSongs: mockFetchUserSongs,
        pagination: null,
        favorites: null,
        stats: null,
        createNewSong: jest.fn(),
        updateExistingSong: jest.fn(),
        deleteExistingSong: jest.fn(),
        fetchUserFavorites: jest.fn(),
        addSongToFavorites: jest.fn(),
        removeSongFromFavorites: jest.fn(),
        searchSongsWithFilters: jest.fn(),
        importSongsBulk: jest.fn(),
        bulkDeleteSongs: jest.fn(),
        exportSongs: jest.fn(),
        getSongStats: jest.fn(),
        getStudentSongs: jest.fn(),
        getUserTestSongs: jest.fn(),
        getAdminFavorites: jest.fn(),
        getAdminUserSongs: jest.fn(),
      });

      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      expect(screen.getByText('Loading songs...')).toBeInTheDocument();
    });

    it('should show error state', () => {
      mockUseSongApi.mockReturnValue({
        songs: [],
        loading: false,
        error: 'Failed to load songs',
        fetchAllSongs: mockFetchAllSongs,
        fetchUserSongs: mockFetchUserSongs,
        pagination: null,
        favorites: null,
        stats: null,
        createNewSong: jest.fn(),
        updateExistingSong: jest.fn(),
        deleteExistingSong: jest.fn(),
        fetchUserFavorites: jest.fn(),
        addSongToFavorites: jest.fn(),
        removeSongFromFavorites: jest.fn(),
        searchSongsWithFilters: jest.fn(),
        importSongsBulk: jest.fn(),
        bulkDeleteSongs: jest.fn(),
        exportSongs: jest.fn(),
        getSongStats: jest.fn(),
        getStudentSongs: jest.fn(),
        getUserTestSongs: jest.fn(),
        getAdminFavorites: jest.fn(),
        getAdminUserSongs: jest.fn(),
      });

      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      expect(screen.getByText('Error loading songs: Failed to load songs')).toBeInTheDocument();
    });
  });

  describe('URL Parameter Handling', () => {
    it('should read page parameter from URL', () => {
      const searchParams = new URLSearchParams('page=2&limit=25');
      mockUseSearchParams.mockReturnValue(searchParams);

      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      expect(screen.getByText('Total songs loaded: 2 (Page 2)')).toBeInTheDocument();
    });

    it('should read limit parameter from URL', () => {
      const searchParams = new URLSearchParams('page=1&limit=100');
      mockUseSearchParams.mockReturnValue(searchParams);

      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      // The component should call fetchAllSongs with the correct limit
      expect(mockFetchAllSongs).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 100,
        })
      );
    });

    it('should read search parameter from URL', () => {
      const searchParams = new URLSearchParams('page=1&limit=50&search=test');
      mockUseSearchParams.mockReturnValue(searchParams);

      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      expect(mockFetchAllSongs).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'test',
        })
      );
    });

    it('should read filter parameters from URL', () => {
      const searchParams = new URLSearchParams('page=1&limit=50&level=Beginner&key=C&author=Test');
      mockUseSearchParams.mockReturnValue(searchParams);

      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      expect(mockFetchAllSongs).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'Beginner',
          key: 'C',
          author: 'Test',
        })
      );
    });

    it('should read sort parameters from URL', () => {
      const searchParams = new URLSearchParams('page=1&limit=50&sortBy=title&sortOrder=asc');
      mockUseSearchParams.mockReturnValue(searchParams);

      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      expect(mockFetchAllSongs).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'title',
          sortOrder: 'asc',
        })
      );
    });
  });

  describe('API Integration', () => {
    it('should call fetchAllSongs for admin users', () => {
      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      expect(mockFetchAllSongs).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 50,
          search: '',
          sortBy: 'created_at',
          sortOrder: 'desc',
        })
      );
    });

    it('should call fetchUserSongs for non-admin users', () => {
      render(
        <TddSongsClient
          userId="user123"
          isAdmin={false}
        />
      );

      expect(mockFetchUserSongs).toHaveBeenCalled();
      expect(mockFetchAllSongs).not.toHaveBeenCalled();
    });

    it('should refetch when URL parameters change', async () => {
      const { rerender } = render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      // Initial call
      expect(mockFetchAllSongs).toHaveBeenCalledTimes(1);

      // Simulate URL parameter change
      const newSearchParams = new URLSearchParams('page=2&limit=25');
      mockUseSearchParams.mockReturnValue(newSearchParams);

      rerender(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      await waitFor(() => {
        expect(mockFetchAllSongs).toHaveBeenCalledTimes(2);
      });

      expect(mockFetchAllSongs).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 2,
          limit: 25,
        })
      );
    });
  });

  describe('Pagination Display', () => {
    it('should show pagination for admin users with pagination data', () => {
      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      // Check that pagination info is displayed
      expect(screen.getByText('Total songs in database: 103')).toBeInTheDocument();
    });

    it('should not show pagination for non-admin users', () => {
      render(
        <TddSongsClient
          userId="user123"
          isAdmin={false}
        />
      );

      // Should not show pagination info for non-admin users
      expect(screen.queryByText('Total songs in database: 103')).not.toBeInTheDocument();
    });

    it('should not show pagination when pagination data is null', () => {
      mockUseSongApi.mockReturnValue({
        songs: mockSongs,
        loading: false,
        error: null,
        fetchAllSongs: mockFetchAllSongs,
        fetchUserSongs: mockFetchUserSongs,
        pagination: null,
        favorites: null,
        stats: null,
        createNewSong: jest.fn(),
        updateExistingSong: jest.fn(),
        deleteExistingSong: jest.fn(),
        fetchUserFavorites: jest.fn(),
        addSongToFavorites: jest.fn(),
        removeSongFromFavorites: jest.fn(),
        searchSongsWithFilters: jest.fn(),
        importSongsBulk: jest.fn(),
        bulkDeleteSongs: jest.fn(),
        exportSongs: jest.fn(),
        getSongStats: jest.fn(),
        getStudentSongs: jest.fn(),
        getUserTestSongs: jest.fn(),
        getAdminFavorites: jest.fn(),
        getAdminUserSongs: jest.fn(),
      });

      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      expect(screen.queryByText('Total songs in database: 103')).not.toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('should use default values when URL parameters are not provided', () => {
      const emptySearchParams = new URLSearchParams('');
      mockUseSearchParams.mockReturnValue(emptySearchParams);

      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
        />
      );

      expect(mockFetchAllSongs).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 50,
          search: '',
          sortBy: 'created_at',
          sortOrder: 'desc',
        })
      );
    });

    it('should use provided initial values when URL parameters are not provided', () => {
      const emptySearchParams = new URLSearchParams('');
      mockUseSearchParams.mockReturnValue(emptySearchParams);

      render(
        <TddSongsClient
          userId="user123"
          isAdmin={true}
          initialPage={3}
          initialLimit={25}
          initialSearch="test"
          initialSortBy="title"
          initialSortOrder="asc"
        />
      );

      expect(mockFetchAllSongs).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 3,
          limit: 25,
          search: 'test',
          sortBy: 'title',
          sortOrder: 'asc',
        })
      );
    });
  });
}); 