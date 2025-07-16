import '@testing-library/jest-dom';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/(main)/song/bulk/route';
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
  chain.single = jest.fn(() => Promise.resolve(returnValue));
  chain.insert = jest.fn(() => chain);
  chain.update = jest.fn(() => chain);
  chain.delete = jest.fn(() => chain);
  chain.in = jest.fn(() => chain);
  chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue));
  return chain;
};

describe('Song Bulk API POST Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should import songs successfully', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true, isTeacher: false };
    const songsToImport = [
      { 
        title: 'Song 1', 
        author: 'Artist 1', 
        level: 'beginner',
        key: 'C',
        ultimate_guitar_link: 'https://www.ultimate-guitar.com/song1'
      },
      { 
        title: 'Song 2', 
        author: 'Artist 2', 
        level: 'intermediate',
        key: 'G',
        ultimate_guitar_link: 'https://www.ultimate-guitar.com/song2'
      },
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
        return createChainedMock({ data: null, error: null }); // No existing song
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/bulk', {
      method: 'POST',
      body: JSON.stringify({ songs: songsToImport }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.results).toHaveLength(2);
    expect(result.summary.total).toBe(2);
    expect(result.summary.success).toBe(2);
    expect(result.summary.error).toBe(0);
  });

  it('should validate songs without importing when validate_only is true', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true, isTeacher: false };
    const songsToValidate = [
      { 
        title: 'Valid Song', 
        author: 'Artist 1', 
        level: 'beginner',
        key: 'C',
        ultimate_guitar_link: 'https://www.ultimate-guitar.com/valid-song'
      },
      { 
        title: '', 
        author: 'Artist 2',
        level: 'intermediate',
        key: 'G',
        ultimate_guitar_link: 'https://www.ultimate-guitar.com/invalid-song'
      }, // Invalid: missing title
    ];

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

    const request = new NextRequest('http://localhost:3000/api/song/bulk', {
      method: 'POST',
      body: JSON.stringify({ songs: songsToValidate, validate_only: true }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.validation_results).toHaveLength(2);
    expect(result.summary.total).toBe(2);
    expect(result.summary.valid).toBe(1);
    expect(result.summary.invalid).toBe(1);
  });

  it('should skip existing songs when overwrite is false', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true, isTeacher: false };
    const songsToImport = [
      { 
        title: 'Existing Song', 
        author: 'Artist 1',
        level: 'beginner',
        key: 'C',
        ultimate_guitar_link: 'https://www.ultimate-guitar.com/existing-song'
      },
      { 
        title: 'New Song', 
        author: 'Artist 2',
        level: 'intermediate',
        key: 'G',
        ultimate_guitar_link: 'https://www.ultimate-guitar.com/new-song'
      },
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
        // First song exists, second doesn't
        if (mockSupabase.from.mock.calls.length === 2) {
          return createChainedMock({ data: { id: 'existing-song' }, error: null });
        }
        if (mockSupabase.from.mock.calls.length === 3) {
          return createChainedMock({ data: null, error: null });
        }
        return createChainedMock({ data: { id: 'new-song' }, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/bulk', {
      method: 'POST',
      body: JSON.stringify({ songs: songsToImport, overwrite: false }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].status).toBe('skipped');
    expect(result.results[1].status).toBe('created');
  });

  it('should update existing songs when overwrite is true', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true, isTeacher: false };
    const songsToImport = [
      { 
        title: 'Existing Song', 
        author: 'Updated Artist',
        level: 'advanced',
        key: 'Am',
        ultimate_guitar_link: 'https://www.ultimate-guitar.com/updated-song'
      },
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
        if (mockSupabase.from.mock.calls.length === 2) {
          return createChainedMock({ data: { id: 'existing-song' }, error: null });
        }
        return createChainedMock({ data: { id: 'existing-song', title: 'Existing Song', author: 'Updated Artist' }, error: null });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/bulk', {
      method: 'POST',
      body: JSON.stringify({ songs: songsToImport, overwrite: true }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].status).toBe('updated');
  });

  it('should return 401 when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const request = new NextRequest('http://localhost:3000/api/song/bulk', {
      method: 'POST',
      body: JSON.stringify({ songs: [] }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result.error).toBe('Unauthorized');
  });

  it('should return 403 when user is not admin or teacher', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    const mockProfile = { isAdmin: false, isTeacher: false };

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

    const request = new NextRequest('http://localhost:3000/api/song/bulk', {
      method: 'POST',
      body: JSON.stringify({ songs: [] }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(403);
    expect(result.error).toBe('Forbidden');
  });

  it('should handle database errors during import', async () => {
    const mockUser = { id: 'admin123', email: 'admin@example.com' };
    const mockProfile = { isAdmin: true, isTeacher: false };
    const songsToImport = [
      { 
        title: 'Error Song', 
        author: 'Artist 1',
        level: 'beginner',
        key: 'C',
        ultimate_guitar_link: 'https://www.ultimate-guitar.com/error-song'
      },
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
        return createChainedMock({ data: null, error: { message: 'Database error' } });
      }
      return createChainedMock({ data: [], error: null });
    });

    const request = new NextRequest('http://localhost:3000/api/song/bulk', {
      method: 'POST',
      body: JSON.stringify({ songs: songsToImport }),
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.results[0].status).toBe('error');
    expect(result.summary.error).toBe(1);
  });
}); 