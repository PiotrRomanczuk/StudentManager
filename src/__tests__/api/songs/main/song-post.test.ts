import '@testing-library/jest-dom';
import { NextRequest } from 'next/server';
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
    const mockProfile = { role: 'admin' };
    const songData = {
      title: 'Test Song',
      author: 'Test Artist',
      level: 'intermediate',
      key: 'C',
      ultimate_guitar_link: 'https://example.com',
    };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock profile query to return admin role
    const mockProfileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
    };

    // Mock songs table operations
    const mockSongsQuery = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ 
        data: { id: 'song123', ...songData, created_at: new Date(), updated_at: new Date() }, 
        error: null 
      }),
    };

    mockSupabase.from
      .mockReturnValueOnce(mockProfileQuery) // First call for profile check
      .mockReturnValueOnce(mockSongsQuery); // Second call for song insert

    const request = new NextRequest('http://localhost:3000/api/song', {
      method: 'POST',
      body: JSON.stringify(songData),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.title).toBe(songData.title);
    expect(result.author).toBe(songData.author);
  });

  it('should return 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const request = new NextRequest('http://localhost:3000/api/song', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Song' }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return 403 when user is not admin or teacher', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockProfile = { role: 'student' }; // Student role - not allowed

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock profile query to return student role
    const mockProfileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
    };

    mockSupabase.from.mockReturnValueOnce(mockProfileQuery);

    const request = new NextRequest('http://localhost:3000/api/song', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Song' }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(403);
    expect(result.error).toBe('Forbidden');
  });

  it('should return 400 for invalid song data', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockProfile = { role: 'admin' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock profile query to return admin role
    const mockProfileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
    };

    mockSupabase.from.mockReturnValueOnce(mockProfileQuery);

    const request = new NextRequest('http://localhost:3000/api/song', {
      method: 'POST',
      body: JSON.stringify({ title: '' }), // Invalid: empty title
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBeDefined();
  });

  it('should return 500 when database insert fails', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockProfile = { role: 'admin' };
    const songData = {
      title: 'Test Song',
      author: 'Test Artist',
      level: 'intermediate',
      key: 'C',
      ultimate_guitar_link: 'https://example.com',
    };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock profile query to return admin role
    const mockProfileQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
    };

    // Mock songs table operations with error
    const mockSongsQuery = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Database error' } 
      }),
    };

    mockSupabase.from
      .mockReturnValueOnce(mockProfileQuery) // First call for profile check
      .mockReturnValueOnce(mockSongsQuery); // Second call for song insert

    const request = new NextRequest('http://localhost:3000/api/song', {
      method: 'POST',
      body: JSON.stringify(songData),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toBe('Database error');
  });
}); 