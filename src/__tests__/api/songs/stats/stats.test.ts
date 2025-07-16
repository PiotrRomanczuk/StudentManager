import '@testing-library/jest-dom';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/(main)/song/stats/route';
import { createClient } from '@/utils/supabase/clients/server';
import { expect } from '@jest/globals';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn(),
  },
};

jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

const createChainedMock = (returnValue: any) => {
  const chain = {} as any;
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.not = jest.fn(() => chain);
  chain.gte = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve(returnValue));
  chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue));
  return chain;
};

describe('Song Stats API GET Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return song statistics for admin user', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ count: 100, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.total_songs).toBe(100);
    expect(result.songs_by_level).toBeDefined();
    expect(result.songs_by_key).toBeDefined();
    expect(result.songs_with_audio).toBeDefined();
    expect(result.songs_with_chords).toBeDefined();
    expect(result.top_authors).toBeDefined();
    expect(result.recent_songs).toBeDefined();
  });

  it('should return 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return 403 when user is not admin', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    const mockProfile = { isAdmin: false };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(403);
    expect(result.error).toBe('Forbidden');
  });

  it('should calculate songs by level correctly', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };
    const mockSongsByLevel = [
      { level: 'beginner' },
      { level: 'beginner' },
      { level: 'intermediate' },
      { level: 'advanced' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    let callCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        callCount++;
        if (callCount === 1) return createChainedMock({ count: 4, error: null }); // totalSongs
        if (callCount === 2) return createChainedMock({ data: mockSongsByLevel, error: null }); // songsByLevel
        if (callCount === 3) return createChainedMock({ data: [], error: null }); // songsByKey
        if (callCount === 4) return createChainedMock({ count: 0, error: null }); // songsWithAudio
        if (callCount === 5) return createChainedMock({ count: 0, error: null }); // songsWithChords
        if (callCount === 6) return createChainedMock({ data: [], error: null }); // topAuthors
        if (callCount === 7) return createChainedMock({ count: 0, error: null }); // recentSongs
        return createChainedMock({ data: [], error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs_by_level).toEqual({
      beginner: 2,
      intermediate: 1,
      advanced: 1,
    });
  });

  it('should calculate songs by key correctly', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };
    const mockSongsByKey = [
      { key: 'C' },
      { key: 'C' },
      { key: 'G' },
      { key: 'F' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    let callCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        callCount++;
        if (callCount === 1) return createChainedMock({ count: 4, error: null }); // totalSongs
        if (callCount === 2) return createChainedMock({ data: [], error: null }); // songsByLevel
        if (callCount === 3) return createChainedMock({ data: mockSongsByKey, error: null }); // songsByKey
        if (callCount === 4) return createChainedMock({ count: 0, error: null }); // songsWithAudio
        if (callCount === 5) return createChainedMock({ count: 0, error: null }); // songsWithChords
        if (callCount === 6) return createChainedMock({ data: [], error: null }); // topAuthors
        if (callCount === 7) return createChainedMock({ count: 0, error: null }); // recentSongs
        return createChainedMock({ data: [], error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs_by_key).toEqual({
      C: 2,
      G: 1,
      F: 1,
    });
  });

  it('should calculate top authors correctly', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };
    const mockTopAuthors = [
      { author: 'Artist 1' },
      { author: 'Artist 1' },
      { author: 'Artist 2' },
      { author: 'Artist 3' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    let callCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        callCount++;
        if (callCount === 1) return createChainedMock({ count: 4, error: null }); // totalSongs
        if (callCount === 2) return createChainedMock({ data: [], error: null }); // songsByLevel
        if (callCount === 3) return createChainedMock({ data: [], error: null }); // songsByKey
        if (callCount === 4) return createChainedMock({ count: 0, error: null }); // songsWithAudio
        if (callCount === 5) return createChainedMock({ count: 0, error: null }); // songsWithChords
        if (callCount === 6) return createChainedMock({ data: mockTopAuthors, error: null }); // topAuthors
        if (callCount === 7) return createChainedMock({ count: 0, error: null }); // recentSongs
        return createChainedMock({ data: [], error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.top_authors).toEqual([
      { author: 'Artist 1', count: 2 },
      { author: 'Artist 2', count: 1 },
      { author: 'Artist 3', count: 1 },
    ]);
  });

  it('should calculate songs with audio correctly', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    let callCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        callCount++;
        if (callCount === 1) return createChainedMock({ count: 100, error: null }); // totalSongs
        if (callCount === 2) return createChainedMock({ data: [], error: null }); // songsByLevel
        if (callCount === 3) return createChainedMock({ data: [], error: null }); // songsByKey
        if (callCount === 4) return createChainedMock({ count: 25, error: null }); // songsWithAudio
        if (callCount === 5) return createChainedMock({ count: 30, error: null }); // songsWithChords
        if (callCount === 6) return createChainedMock({ data: [], error: null }); // topAuthors
        if (callCount === 7) return createChainedMock({ count: 0, error: null }); // recentSongs
        return createChainedMock({ data: [], error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs_with_audio).toBe(25);
    expect(result.songs_with_chords).toBe(30);
    expect(result.songs_without_audio).toBe(75);
    expect(result.songs_without_chords).toBe(70);
  });

  it('should calculate recent songs correctly', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    let callCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        callCount++;
        if (callCount === 1) return createChainedMock({ count: 100, error: null }); // totalSongs
        if (callCount === 2) return createChainedMock({ data: [], error: null }); // songsByLevel
        if (callCount === 3) return createChainedMock({ data: [], error: null }); // songsByKey
        if (callCount === 4) return createChainedMock({ count: 0, error: null }); // songsWithAudio
        if (callCount === 5) return createChainedMock({ count: 0, error: null }); // songsWithChords
        if (callCount === 6) return createChainedMock({ data: [], error: null }); // topAuthors
        if (callCount === 7) return createChainedMock({ count: 5, error: null }); // recentSongs
        return createChainedMock({ data: [], error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.recent_songs).toBe(5);
  });

  it('should handle database errors gracefully', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    let callCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        callCount++;
        if (callCount === 1) return createChainedMock({ count: 4, error: null }); // totalSongs
        if (callCount === 2) throw new Error('Database error'); // Simulate DB error on songsByLevel
        return createChainedMock({ data: [], error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toBe('Internal server error');
  });

  it('should handle empty statistics', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ count: 0, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.total_songs).toBe(0);
    expect(result.songs_by_level).toEqual({});
    expect(result.songs_by_key).toEqual({});
    expect(result.top_authors).toEqual([]);
    expect(result.average_songs_per_author).toBe(0);
  });

  it('should calculate average songs per author correctly', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };
    const mockTopAuthors = [
      { author: 'Artist 1' },
      { author: 'Artist 1' },
      { author: 'Artist 2' },
      { author: 'Artist 2' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    let callCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        callCount++;
        if (callCount === 1) return createChainedMock({ count: 4, error: null }); // totalSongs
        if (callCount === 2) return createChainedMock({ data: [], error: null }); // songsByLevel
        if (callCount === 3) return createChainedMock({ data: [], error: null }); // songsByKey
        if (callCount === 4) return createChainedMock({ count: 0, error: null }); // songsWithAudio
        if (callCount === 5) return createChainedMock({ count: 0, error: null }); // songsWithChords
        if (callCount === 6) return createChainedMock({ data: mockTopAuthors, error: null }); // topAuthors
        if (callCount === 7) return createChainedMock({ count: 0, error: null }); // recentSongs
        return createChainedMock({ data: [], error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.average_songs_per_author).toBe(2);
  });
}); 