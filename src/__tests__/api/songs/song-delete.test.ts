import '@testing-library/jest-dom';
import { DELETE } from '@/app/api/(main)/song/route';
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
  chain.delete = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve(returnValue));
  chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue)); // for await
  return chain;
};

describe('Songs API DELETE Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a song successfully', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const songId = 'song123';

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: { role: 'user' }, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: { id: songId, userId: mockUser.id }, error: null });
      }
      return createChainedMock({ data: null, error: null });
    });

    const request = new Request(`http://localhost:3000/api/song?id=${songId}`, {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
  });

  it('should return 404 when song is not found', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const songId = 'nonexistent';

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'profiles') {
        return createChainedMock({ data: { role: 'user' }, error: null });
      }
      if (table === 'songs') {
        return createChainedMock({ data: null, error: { message: 'Song not found' } });
      }
      return createChainedMock({ data: null, error: null });
    });

    const request = new Request(`http://localhost:3000/api/song?id=${songId}`, {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    const result = await response.json();

    expect(response.status).toBe(404);
    expect(result.error).toBe('Song not found');
  });

  it('should return 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const request = new Request('http://localhost:3000/api/song?id=song123', {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return 400 when song ID is missing', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const request = new Request('http://localhost:3000/api/song', {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBe('Song ID is required');
  });
}); 