import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { getSongsHandler } from '@/app/api/(main)/song/handlers';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(),
};

const createChainedMock = (returnValue: any) => {
  const chain = {} as any;
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve(returnValue));
  chain.ilike = jest.fn(() => chain);
  chain.order = jest.fn(() => chain);
  chain.range = jest.fn(() => chain);
  chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue));
  return chain;
};

describe('getSongsHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all songs for admin user', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };
    const mockSongs = [
      { id: 'song1', title: 'Song 1', author: 'Artist 1' },
      { id: 'song2', title: 'Song 2', author: 'Artist 2' },
    ];

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null, count: 2 })
    );

    const result = await getSongsHandler(mockSupabase, mockUser, mockProfile, {});

    expect('error' in result).toBe(false);
    if ('songs' in result) {
      expect(result.songs).toHaveLength(2);
      expect(result.count).toBe(2);
    }
    expect(mockSupabase.from).toHaveBeenCalledWith('songs');
  });

  it('should return user-specific songs for regular user', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    const mockProfile = { isAdmin: false };
    const mockSongs = [
      { id: 'song1', title: 'User Song 1', userId: 'user123' },
    ];

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null })
    );

    const result = await getSongsHandler(mockSupabase, mockUser, mockProfile, {});

    expect('error' in result).toBe(false);
    if ('songs' in result) {
      expect(result.songs).toHaveLength(1);
    }
    expect(mockSupabase.from).toHaveBeenCalledWith('songs');
  });

  it('should return 401 when user is not authenticated', async () => {
    const result = await getSongsHandler(mockSupabase, null, null, {});

    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error).toBe('Unauthorized');
      expect(result.status).toBe(401);
    }
  });

  it('should return 403 when profile is not found', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    const result = await getSongsHandler(mockSupabase, mockUser, null, {});

    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error).toBe('Forbidden');
      expect(result.status).toBe(403);
    }
  });

  it('should apply filters correctly', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };
    const mockSongs = [{ id: 'song1', title: 'Filtered Song' }];

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: mockSongs, error: null })
    );

    const result = await getSongsHandler(mockSupabase, mockUser, mockProfile, {
      level: 'intermediate',
      key: 'C',
      author: 'Test Artist',
      search: 'test',
    });

    expect('error' in result).toBe(false);
    expect(mockSupabase.from).toHaveBeenCalledWith('songs');
  });

  it('should handle database errors', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };

    mockSupabase.from.mockImplementation(() => 
      createChainedMock({ data: null, error: { message: 'Database error' } })
    );

    const result = await getSongsHandler(mockSupabase, mockUser, mockProfile, {});

    expect('error' in result).toBe(true);
    if ('error' in result) {
      expect(result.error).toBe('Database error');
      expect(result.status).toBe(500);
    }
  });
}); 