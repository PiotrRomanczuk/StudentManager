import '@testing-library/jest-dom';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/(main)/song/export/route';
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
  chain.order = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve(returnValue));
  chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue));
  return chain;
};

describe('Song Export API GET Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export songs as JSON', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { role: 'admin' };
    const mockSongs = [
      { id: 'song1', title: 'Song 1', author: 'Artist 1', level: 'beginner' },
      { id: 'song2', title: 'Song 2', author: 'Artist 2', level: 'intermediate' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: mockSongs, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/export?format=json');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="songs.json"');
  });

  it('should export songs as CSV', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { role: 'admin' };
    const mockSongs = [
      { id: 'song1', title: 'Song 1', author: 'Artist 1', level: 'beginner', key: 'C', chords: 'C, F, G', ultimate_guitar_link: 'https://example.com', created_at: '2024-01-01' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: mockSongs, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/export?format=csv');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/csv');
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="songs.csv"');
  });

  it('should export songs as PDF data', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { role: 'admin' };
    const mockSongs = [
      { id: 'song1', title: 'Song 1', author: 'Artist 1' },
      { id: 'song2', title: 'Song 2', author: 'Artist 2' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: mockSongs, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/export?format=pdf');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="songs.pdf"');
    expect(result.songs).toHaveLength(2);
    expect(result.metadata.total).toBe(2);
    expect(result.metadata.exported_at).toBeDefined();
  });

  it('should filter songs by level', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { role: 'admin' };
    const mockSongs = [
      { id: 'song1', title: 'Song 1', level: 'beginner' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: mockSongs, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/export?format=json&level=beginner');
    const response = await GET(request);

    expect(response.status).toBe(200);
  });

  it('should filter songs by key', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { role: 'admin' };
    const mockSongs = [
      { id: 'song1', title: 'Song 1', key: 'C' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: mockSongs, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/export?format=json&key=C');
    const response = await GET(request);

    expect(response.status).toBe(200);
  });

  it('should filter songs by author', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { role: 'admin' };
    const mockSongs = [
      { id: 'song1', title: 'Song 1', author: 'Artist 1' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: mockSongs, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/export?format=json&author=Artist');
    const response = await GET(request);

    expect(response.status).toBe(200);
  });

  it('should return 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const request = new NextRequest('http://localhost:3000/api/song/export?format=json');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return 403 when user is not admin or teacher', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    const mockProfile = { role: 'student' };

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

    const request = new NextRequest('http://localhost:3000/api/song/export?format=json');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(403);
    expect(result.error).toBe('Forbidden');
  });

  it('should return 400 for unsupported format', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { role: 'admin' };

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

    const request = new NextRequest('http://localhost:3000/api/song/export?format=unsupported');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBe('Invalid export parameters');
  });

  it('should handle database errors', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { role: 'admin' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: null, error: { message: 'Database error' } });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/export?format=json');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toBe('Database error');
  });

  it('should handle empty song list', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { role: 'admin' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: [], error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/export?format=json');
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });

  it('should handle multiple filters', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { role: 'admin' };
    const mockSongs = [
      { id: 'song1', title: 'Song 1', level: 'beginner', key: 'C', author: 'Artist 1' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: mockProfile, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: mockSongs, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/export?format=json&level=beginner&key=C&author=Artist');
    const response = await GET(request);

    expect(response.status).toBe(200);
  });
}); 