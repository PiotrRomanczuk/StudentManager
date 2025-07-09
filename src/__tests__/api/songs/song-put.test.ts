import '@testing-library/jest-dom';
import { PUT } from '@/app/api/(main)/song/route';
import { createClient } from '@/utils/supabase/clients/server';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  auth: {
    getUser: jest.fn(),
  },
};

jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

describe('Songs API PUT Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a song successfully', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const songId = 'song123';
    const updateData = {
      title: 'Updated Song Title',
      notes: 'Updated notes',
    };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.single.mockResolvedValue({
      data: { id: songId, ...updateData, userId: mockUser.id },
      error: null,
    });

    const request = new Request(`http://localhost:3000/api/song?id=${songId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    const response = await PUT(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.title).toBe(updateData.title);
    expect(mockSupabase.from).toHaveBeenCalledWith('songs');
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', songId);
  });

  it('should return 404 when song is not found', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const songId = 'nonexistent';

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'Song not found' },
    });

    const request = new Request(`http://localhost:3000/api/song?id=${songId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PUT(request);
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
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PUT(request);
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
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PUT(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBe('Song ID is required');
  });
}); 