import '@testing-library/jest-dom';
import { GET } from '@/app/api/(main)/song/user-songs/route';
import { expect } from '@jest/globals';
import { NextRequest } from 'next/server';

const mockSupabase = {
  from: jest.fn(),
};

jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

function createMockNextRequest(url: string): NextRequest {
  return {
    url,
    nextUrl: new URL(url),
  } as unknown as NextRequest;
}

describe('/api/song/user-songs - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from.mockReset();
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
}); 