import '@testing-library/jest-dom';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/(main)/song/route';
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
  chain.range = jest.fn(() => Promise.resolve(returnValue));
  return chain;
};

describe('Songs API GET Operations', () => {
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

    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
        };
      }
      if (table === 'songs') {
        return createChainedMock({ data: mockSongs, error: null, count: 2 });
      }
      return {};
    });

    const request = new NextRequest('http://localhost:3000/api/song');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs).toHaveLength(2);
    expect(result.songs[0]).toEqual(mockSongs[0]);
    expect(result.songs[1]).toEqual(mockSongs[1]);
  });

  it('should return 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

    const request = new NextRequest('http://localhost:3000/api/song');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.error).toBe('Unauthorized');
  });

  it('should create profile and return songs when user profile is not found', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    const mockSongs = [{ id: 'song1', title: 'User Song 1', userId: 'user123' }];
    
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        // First call: profile not found (PGRST116 error)
        const firstCall = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { code: 'PGRST116', message: 'No rows returned' } 
          }),
        };
        // Second call: profile creation
        const secondCall = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ 
            data: { isAdmin: false }, 
            error: null 
          }),
          insert: jest.fn().mockReturnThis(),
        };
        return mockSupabase.from.mock.calls.length === 1 ? firstCall : secondCall;
      }
      if (table === 'songs') {
        return createChainedMock({ data: mockSongs, error: null, count: 1 });
      }
      return {};
    });

    const request = new NextRequest('http://localhost:3000/api/song');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.songs).toHaveLength(1);
  });

  it('should handle database errors', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true };
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
        };
      }
      if (table === 'songs') {
        return createChainedMock({ data: null, error: { message: 'Database error' } });
      }
      return {};
    });

    const request = new NextRequest('http://localhost:3000/api/song');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toBe('Database error');
  });
}); 