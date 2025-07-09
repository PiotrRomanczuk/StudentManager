import '@testing-library/jest-dom';
import { GET } from '@/app/api/(main)/song/route';
import { createClient } from '@/utils/supabase/clients/server';

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
  chain.single = jest.fn(() => Promise.resolve(returnValue));
  chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue)); // for await
  return chain;
};

describe('Songs API GET Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all songs for admin user', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
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
        return createChainedMock({ data: { role: 'admin' }, error: null });
      }
      return createChainedMock({ data: mockSongs, error: null });
    });

    const request = new Request('http://localhost:3000/api/song');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toHaveLength(2);
    expect(mockSupabase.from).toHaveBeenCalledWith('songs');
  });

  it('should return user-specific songs for regular user', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    const mockSongs = [
      { id: 'song1', title: 'User Song 1', userId: 'user123' },
    ];

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: { role: 'user' }, error: null });
      }
      return createChainedMock({ data: mockSongs, error: null });
    });

    const request = new Request('http://localhost:3000/api/song');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toHaveLength(1);
  });

  it('should return 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const request = new Request('http://localhost:3000/api/song');
    const response = await GET(request);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.error).toBe('Unauthorized');
  });
}); 