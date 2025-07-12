import '@testing-library/jest-dom';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/(main)/song/search/route';
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
  chain.ilike = jest.fn(() => chain);
  chain.or = jest.fn(() => chain);
  chain.not = jest.fn(() => chain);
  chain.range = jest.fn(() => chain);
  chain.order = jest.fn(() => chain);
  chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue));
  return chain;
};

describe('Song Search API GET Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return search results with pagination', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSongs = [
      { id: 'song1', title: 'Song 1', author: 'Artist 1' },
      { id: 'song2', title: 'Song 2', author: 'Artist 2' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null, count: 2 })
    );

    const request = new NextRequest('http://localhost:3000/api/song/search?q=test&page=1&limit=20');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs).toHaveLength(2);
    expect(result.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 2,
      totalPages: 1,
    });
    expect(result.filters).toEqual({
      search: 'test',
      level: null,
      key: null,
      author: null,
      hasAudio: null,
      hasChords: null,
    });
  });

  it('should return 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const request = new NextRequest('http://localhost:3000/api/song/search?q=test');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.error).toBe('Unauthorized');
  });

  it('should filter by level', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSongs = [{ id: 'song1', title: 'Song 1', level: 'beginner' }];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null, count: 1 })
    );

    const request = new NextRequest('http://localhost:3000/api/song/search?level=beginner');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs).toHaveLength(1);
    expect(result.filters.level).toBe('beginner');
  });

  it('should filter by key', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSongs = [{ id: 'song1', title: 'Song 1', key: 'C' }];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null, count: 1 })
    );

    const request = new NextRequest('http://localhost:3000/api/song/search?key=C');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs).toHaveLength(1);
    expect(result.filters.key).toBe('C');
  });

  it('should filter by author', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSongs = [{ id: 'song1', title: 'Song 1', author: 'Artist 1' }];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null, count: 1 })
    );

    const request = new NextRequest('http://localhost:3000/api/song/search?author=Artist');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs).toHaveLength(1);
    expect(result.filters.author).toBe('Artist');
  });

  it('should filter songs with audio', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSongs = [{ id: 'song1', title: 'Song 1', audio_files: ['url1'] }];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null, count: 1 })
    );

    const request = new NextRequest('http://localhost:3000/api/song/search?hasAudio=true');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs).toHaveLength(1);
    expect(result.filters.hasAudio).toBe('true');
  });

  it('should filter songs with chords', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSongs = [{ id: 'song1', title: 'Song 1', chords: 'C, F, G' }];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null, count: 1 })
    );

    const request = new NextRequest('http://localhost:3000/api/song/search?hasChords=true');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs).toHaveLength(1);
    expect(result.filters.hasChords).toBe('true');
  });

  it('should handle database errors', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: null, error: { message: 'Database error' } })
    );

    const request = new NextRequest('http://localhost:3000/api/song/search?q=test');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toBe('Database error');
  });

  it('should handle empty search results', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: [], error: null, count: 0 })
    );

    const request = new NextRequest('http://localhost:3000/api/song/search?q=nonexistent');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs).toEqual([]);
    expect(result.pagination.total).toBe(0);
  });

  it('should handle pagination correctly', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSongs = Array.from({ length: 10 }, (_, i) => ({
      id: `song${i}`,
      title: `Song ${i}`,
      author: `Artist ${i}`,
    }));

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null, count: 50 })
    );

    const request = new NextRequest('http://localhost:3000/api/song/search?page=2&limit=10');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 50,
      totalPages: 5,
    });
  });

  it('should handle multiple filters', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockSongs = [{ id: 'song1', title: 'Song 1', level: 'beginner', key: 'C' }];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null, count: 1 })
    );

    const request = new NextRequest('http://localhost:3000/api/song/search?level=beginner&key=C&author=Artist');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.filters).toEqual({
      search: '',
      level: 'beginner',
      key: 'C',
      author: 'Artist',
      hasAudio: null,
      hasChords: null,
    });
  });
}); 