import '@testing-library/jest-dom';
import { GET } from '@/app/api/(main)/song/user-songs/route';
import { expect } from '@jest/globals';
import { NextRequest } from 'next/server';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(),
};

jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

// Helper function to create mock NextRequest
function createMockNextRequest(url: string): NextRequest {
  return {
    url,
    nextUrl: new URL(url),
  } as unknown as NextRequest;
}

describe('/api/song/user-songs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from.mockReset();
  });

  describe('GET - With userId parameter', () => {
    it('should return user songs with status when userId is provided', async () => {
      const mockLessons = [{ id: 'lesson1' }, { id: 'lesson2' }];
      const mockLessonSongs = [
        { song_id: 'song1', song_status: 'active' },
        { song_id: 'song2', song_status: 'completed' },
      ];
      const mockSongs = [
        { id: 'song1', title: 'Song 1', artist: 'Artist 1' },
        { id: 'song2', title: 'Song 2', artist: 'Artist 2' },
      ];

      // Mock lessons query
      const lessonsSelectMock = jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({
          data: mockLessons,
          error: null,
        }),
      });

      // Mock lesson songs query
      const lessonSongsSelectMock = jest.fn().mockReturnValue({
        in: jest.fn().mockResolvedValue({
          data: mockLessonSongs,
          error: null,
        }),
      });

      // Mock songs query
      const songsSelectMock = jest.fn().mockReturnValue({
        in: jest.fn().mockResolvedValue({
          data: mockSongs,
          error: null,
          count: 2,
        }),
      });

      mockSupabase.from
        .mockReturnValueOnce({ select: lessonsSelectMock }) // lessons
        .mockReturnValueOnce({ select: lessonSongsSelectMock }) // lesson_songs
        .mockReturnValueOnce({ select: songsSelectMock }); // songs

      const mockRequest = createMockNextRequest('http://localhost:3000/api/song/user-songs?userId=user123');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.songs).toHaveLength(2);
      expect(data.pagination.total).toBe(2);
      expect(data.songs[0]).toEqual({
        ...mockSongs[0],
        status: 'active',
      });
      expect(data.songs[1]).toEqual({
        ...mockSongs[1],
        status: 'completed',
      });

      // Verify the OR query was called correctly
      expect(lessonsSelectMock).toHaveBeenCalledWith('id');
      expect(lessonsSelectMock().or).toHaveBeenCalledWith('student_id.eq.user123,teacher_id.eq.user123');
    });

    it('should return empty songs array when user has no lessons', async () => {
      // Mock lessons query returning empty array
      const lessonsSelectMock = jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      });

      mockSupabase.from.mockReturnValue({ select: lessonsSelectMock });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/song/user-songs?userId=user123');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.songs).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });

    it('should return empty songs array when user has lessons but no lesson songs', async () => {
      const mockLessons = [{ id: 'lesson1' }];

      // Mock lessons query
      const lessonsSelectMock = jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({
          data: mockLessons,
          error: null,
        }),
      });

      // Mock lesson songs query returning empty array
      const lessonSongsSelectMock = jest.fn().mockReturnValue({
        in: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      });

      mockSupabase.from
        .mockReturnValueOnce({ select: lessonsSelectMock })
        .mockReturnValueOnce({ select: lessonSongsSelectMock });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/song/user-songs?userId=user123');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.songs).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });

    it('should handle lessons fetch error', async () => {
      const lessonsSelectMock = jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Lessons fetch error' },
        }),
      });

      mockSupabase.from.mockReturnValue({ select: lessonsSelectMock });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/song/user-songs?userId=user123');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error fetching lessons');
    });

    it('should handle lesson songs fetch error', async () => {
      const mockLessons = [{ id: 'lesson1' }];

      const lessonsSelectMock = jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({
          data: mockLessons,
          error: null,
        }),
      });

      const lessonSongsSelectMock = jest.fn().mockReturnValue({
        in: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Lesson songs fetch error' },
        }),
      });

      mockSupabase.from
        .mockReturnValueOnce({ select: lessonsSelectMock })
        .mockReturnValueOnce({ select: lessonSongsSelectMock });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/song/user-songs?userId=user123');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error fetching lesson songs');
    });

    it('should handle songs fetch error', async () => {
      const mockLessons = [{ id: 'lesson1' }];
      const mockLessonSongs = [{ song_id: 'song1', song_status: 'active' }];

      const lessonsSelectMock = jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({
          data: mockLessons,
          error: null,
        }),
      });

      const lessonSongsSelectMock = jest.fn().mockReturnValue({
        in: jest.fn().mockResolvedValue({
          data: mockLessonSongs,
          error: null,
        }),
      });

      const songsSelectMock = jest.fn().mockReturnValue({
        in: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Songs fetch error' },
        }),
      });

      mockSupabase.from
        .mockReturnValueOnce({ select: lessonsSelectMock })
        .mockReturnValueOnce({ select: lessonSongsSelectMock })
        .mockReturnValueOnce({ select: songsSelectMock });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/song/user-songs?userId=user123');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error fetching user songs');
    });
  });

  describe('GET - Without userId parameter', () => {
    it('should return all songs when no userId is provided', async () => {
      const mockSongs = [
        { id: 'song1', title: 'Song 1', artist: 'Artist 1' },
        { id: 'song2', title: 'Song 2', artist: 'Artist 2' },
      ];

      const songsSelectMock = jest.fn().mockResolvedValue({
        data: mockSongs,
        error: null,
        count: 2,
      });

      mockSupabase.from.mockReturnValue({ select: songsSelectMock });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/song/user-songs');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.songs).toEqual(mockSongs);
      expect(data.pagination.total).toBe(2);
      expect(songsSelectMock).toHaveBeenCalledWith('*', { count: 'exact' });
    });

    it('should handle error when fetching all songs', async () => {
      const songsSelectMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Songs fetch error' },
      });

      mockSupabase.from.mockReturnValue({ select: songsSelectMock });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/song/user-songs');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error fetching songs');
    });

    it('should handle empty songs result', async () => {
      const songsSelectMock = jest.fn().mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      mockSupabase.from.mockReturnValue({ select: songsSelectMock });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/song/user-songs');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.songs).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });
  });

  describe('GET - URL parsing', () => {
    it('should handle URL with userId parameter correctly', async () => {
      const mockLessons = [{ id: 'lesson1' }];
      const mockLessonSongs = [{ song_id: 'song1', song_status: 'active' }];
      const mockSongs = [{ id: 'song1', title: 'Song 1' }];

      const lessonsSelectMock = jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({
          data: mockLessons,
          error: null,
        }),
      });

      const lessonSongsSelectMock = jest.fn().mockReturnValue({
        in: jest.fn().mockResolvedValue({
          data: mockLessonSongs,
          error: null,
        }),
      });

      const songsSelectMock = jest.fn().mockReturnValue({
        in: jest.fn().mockResolvedValue({
          data: mockSongs,
          error: null,
          count: 1,
        }),
      });

      mockSupabase.from
        .mockReturnValueOnce({ select: lessonsSelectMock })
        .mockReturnValueOnce({ select: lessonSongsSelectMock })
        .mockReturnValueOnce({ select: songsSelectMock });

      const mockRequest = createMockNextRequest('https://example.com/api/song/user-songs?userId=test123&otherParam=value');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.songs).toHaveLength(1);
      expect(lessonsSelectMock().or).toHaveBeenCalledWith('student_id.eq.test123,teacher_id.eq.test123');
    });

    it('should handle URL without userId parameter', async () => {
      const mockSongs = [{ id: 'song1', title: 'Song 1' }];

      const songsSelectMock = jest.fn().mockResolvedValue({
        data: mockSongs,
        error: null,
        count: 1,
      });

      mockSupabase.from.mockReturnValue({ select: songsSelectMock });

      const mockRequest = createMockNextRequest('https://example.com/api/song/user-songs?otherParam=value');

      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.songs).toEqual(mockSongs);
      expect(songsSelectMock).toHaveBeenCalledWith('*', { count: 'exact' });
    });
  });
}); 