import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '@/app/api/(main)/lessons/songs/[id]/route';
import { createClient } from '@/utils/supabase/clients/server';
import { expect } from '@jest/globals';

// Mock the Supabase client
jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(),
}));

// Helper to create a fully thenable mock query chain
function createThenableQueryChain(data: any, error: any = null) {
  const chain: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    // For .then chaining
    then: undefined,
    catch: undefined,
    finally: undefined,
  };
  // Make it a real thenable
  const promise = Promise.resolve({ data, error });
  chain.then = promise.then.bind(promise);
  chain.catch = promise.catch.bind(promise);
  chain.finally = promise.finally.bind(promise);
  return chain;
}

describe('/api/lessons/songs/[id]', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/lessons/songs/[id]', () => {
    it('should return a specific lesson song assignment', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessonSong = {
        id: 'assignment-1',
        lesson_id: 'lesson-1',
        song_id: 'song-1',
        song_status: 'started',
        student_id: 'student-1',
        song: {
          title: 'Wonderwall',
          author: 'Oasis',
          level: 'intermediate',
          key: 'C',
          ultimate_guitar_link: 'https://www.ultimate-guitar.com/wonderwall'
        },
        lesson: {
          title: 'Guitar Basics',
          date: '2024-01-15T10:00:00Z',
          status: 'SCHEDULED'
        },
        student: {
          email: 'student@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessonSong));

      const params = Promise.resolve({ id: 'assignment-1' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/assignment-1');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockLessonSong);
    });

    it('should return 404 when lesson song assignment does not exist', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(null, { code: 'PGRST116' }));

      const params = Promise.resolve({ id: 'non-existent-assignment' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/non-existent-assignment');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Lesson song assignment not found');
    });

    it('should return 401 when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const params = Promise.resolve({ id: 'assignment-1' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/assignment-1');
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('PUT /api/lessons/songs/[id]', () => {
    it('should update song status successfully', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockProfile = { role: 'teacher' };
      const mockUpdatedLessonSong = {
        id: 'assignment-1',
        lesson_id: 'lesson-1',
        song_id: 'song-1',
        song_status: 'mastered',
        student_id: 'student-1',
        song: {
          title: 'Wonderwall',
          author: 'Oasis',
          level: 'intermediate',
          key: 'C'
        },
        lesson: {
          title: 'Guitar Basics',
          date: '2024-01-15T10:00:00Z',
          status: 'SCHEDULED'
        }
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockProfile));
      mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockUpdatedLessonSong));

      const requestBody = {
        song_status: 'mastered'
      };

      const params = Promise.resolve({ id: 'assignment-1' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/assignment-1', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUpdatedLessonSong);
    });

    it('should return 400 when invalid song status is provided', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockProfile = { role: 'teacher' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

      const requestBody = {
        song_status: 'invalid_status'
      };

      const params = Promise.resolve({ id: 'assignment-1' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/assignment-1', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid song status');
    });

    it('should return 403 when user does not have permission', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockProfile = { role: 'student' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

      const requestBody = {
        song_status: 'mastered'
      };

      const params = Promise.resolve({ id: 'assignment-1' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/assignment-1', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden');
    });

    it('should return 404 when lesson song assignment does not exist', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockProfile = { role: 'teacher' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockProfile));
      mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(null, { code: 'PGRST116' }));

      const requestBody = {
        song_status: 'mastered'
      };

      const params = Promise.resolve({ id: 'non-existent-assignment' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/non-existent-assignment', {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Lesson song assignment not found');
    });
  });

  describe('DELETE /api/lessons/songs/[id]', () => {
    it('should delete lesson song assignment successfully', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockProfile = { role: 'teacher' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockProfile));
      mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(null));

      const params = Promise.resolve({ id: 'assignment-1' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/assignment-1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should return 403 when user does not have permission', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockProfile = { role: 'student' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

      const params = Promise.resolve({ id: 'assignment-1' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/assignment-1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden');
    });

    it('should return 404 when lesson song assignment does not exist', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockProfile = { role: 'teacher' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockProfile));
      mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(null, { code: 'PGRST116' }));

      const params = Promise.resolve({ id: 'non-existent-assignment' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/non-existent-assignment', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Lesson song assignment not found');
    });

    it('should return 401 when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const params = Promise.resolve({ id: 'assignment-1' });
      const request = new NextRequest('http://localhost:3000/api/lessons/songs/assignment-1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
}); 