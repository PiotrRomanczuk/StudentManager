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

describe('/api/song/user-songs - Filtering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from.mockReset();
  });

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