import '@testing-library/jest-dom';
import { POST } from '@/app/api/(main)/song/route';
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
  chain.insert = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve(returnValue));
  chain.maybeSingle = jest.fn(() => Promise.resolve(returnValue));
  chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue)); // for await
  return chain;
};

describe('Songs API POST Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new song successfully', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const songData = {
      title: 'Test Song',
      author: 'Test Artist',
      level: 'intermediate',
      key: 'C',
      chords: 'C G Am F',
    };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'songs') {
        // First call (duplicate check) returns null, second call (insert) returns the created song
        const callCount = mockSupabase.from.mock.calls.length;
        if (callCount === 1) {
          return createChainedMock({ data: null, error: null }); // No existing song
        } else {
          return createChainedMock({ data: { id: 'song123', ...songData, userId: mockUser.id }, error: null });
        }
      }
      return createChainedMock({ data: null, error: null });
    });

    const request = new Request('http://localhost:3000/api/song', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.title).toBe(songData.title);
    expect(result.author).toBe(songData.author);
  });

  it('should return 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const request = new Request('http://localhost:3000/api/song', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Song' }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return 400 for invalid song data', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const request = new Request('http://localhost:3000/api/song', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }), // Invalid: empty title
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBeDefined();
  });

  it('should return 409 when song with same title already exists', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const songData = {
      title: 'Existing Song',
      author: 'Test Artist',
      level: 'intermediate',
      key: 'C',
    };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'songs') {
        return createChainedMock({ data: { id: 'existing123', title: 'Existing Song' }, error: null });
      }
      return createChainedMock({ data: null, error: null });
    });

    const request = new Request('http://localhost:3000/api/song', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(409);
    expect(result.error).toBe('A song with this title already exists.');
  });
}); 