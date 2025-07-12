import { NextRequest } from 'next/server';
import { GET } from '@/app/api/(main)/lessons/export/route';
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
    or: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
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

describe('/api/lessons/export', () => {
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

  describe('GET /api/lessons/export', () => {
    it('should export lessons in JSON format by default', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        {
          id: 'lesson-1',
          title: 'Guitar Basics',
          student_id: 'student-1',
          teacher_id: 'teacher-1',
          date: '2024-01-15T10:00:00Z',
          status: 'SCHEDULED',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons/export');
      const response = await GET(request);
      const data = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
      expect(response.headers.get('Content-Disposition')).toContain('attachment');
      expect(response.headers.get('Content-Disposition')).toContain('.json');
      
      const jsonData = JSON.parse(data);
      expect(jsonData.exportDate).toBeDefined();
      expect(jsonData.totalLessons).toBe(1);
      expect(jsonData.lessons).toEqual(mockLessons);
    });

    it('should export lessons in CSV format', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        {
          id: 'lesson-1',
          title: 'Guitar Basics',
          student_id: 'student-1',
          teacher_id: 'teacher-1',
          date: '2024-01-15T10:00:00Z',
          time: '10:00',
          status: 'SCHEDULED',
          notes: 'First lesson',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons/export?format=csv');
      const response = await GET(request);
      const data = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/csv');
      expect(response.headers.get('Content-Disposition')).toContain('attachment');
      expect(response.headers.get('Content-Disposition')).toContain('.csv');
      
      expect(data).toContain('ID,Title,Student ID,Teacher ID,Date,Time,Status,Notes,Created At,Updated At');
      expect(data).toContain('lesson-1');
      expect(data).toContain('Guitar Basics');
    });

    it('should filter by user ID', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        {
          id: 'lesson-1',
          title: 'Guitar Basics',
          student_id: 'student-1',
          teacher_id: 'teacher-1',
          date: '2024-01-15T10:00:00Z',
          status: 'SCHEDULED'
        }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons/export?userId=user123');
      const response = await GET(request);
      const data = await response.text();

      expect(response.status).toBe(200);
      
      const jsonData = JSON.parse(data);
      expect(jsonData.filters.userId).toBe('user123');
    });

    it('should filter by status', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        {
          id: 'lesson-1',
          title: 'Guitar Basics',
          student_id: 'student-1',
          teacher_id: 'teacher-1',
          date: '2024-01-15T10:00:00Z',
          status: 'COMPLETED'
        }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons/export?status=COMPLETED');
      const response = await GET(request);
      const data = await response.text();

      expect(response.status).toBe(200);
      
      const jsonData = JSON.parse(data);
      expect(jsonData.filters.status).toBe('COMPLETED');
    });

    it('should filter by date range', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        {
          id: 'lesson-1',
          title: 'Guitar Basics',
          student_id: 'student-1',
          teacher_id: 'teacher-1',
          date: '2024-01-15T10:00:00Z',
          status: 'SCHEDULED'
        }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons/export?dateFrom=2024-01-01&dateTo=2024-12-31');
      const response = await GET(request);
      const data = await response.text();

      expect(response.status).toBe(200);
      
      const jsonData = JSON.parse(data);
      expect(jsonData.filters.dateFrom).toBe('2024-01-01');
      expect(jsonData.filters.dateTo).toBe('2024-12-31');
    });

    it('should include songs when requested', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        {
          id: 'lesson-1',
          title: 'Guitar Basics',
          student_id: 'student-1',
          teacher_id: 'teacher-1',
          date: '2024-01-15T10:00:00Z',
          status: 'SCHEDULED',
          lesson_songs: [
            {
              song_id: 'song-1',
              song_status: 'started',
              songs: {
                title: 'Wonderwall',
                author: 'Oasis',
                level: 'intermediate',
                key: 'C'
              }
            }
          ]
        }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons/export?includeSongs=true');
      const response = await GET(request);
      const data = await response.text();

      expect(response.status).toBe(200);
      
      const jsonData = JSON.parse(data);
      expect(jsonData.filters.includeSongs).toBe(true);
      expect(jsonData.lessons[0].lesson_songs).toBeDefined();
    });

    it('should include profiles when requested', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        {
          id: 'lesson-1',
          title: 'Guitar Basics',
          student_id: 'student-1',
          teacher_id: 'teacher-1',
          date: '2024-01-15T10:00:00Z',
          status: 'SCHEDULED',
          profile: {
            email: 'student@example.com',
            firstName: 'John',
            lastName: 'Doe'
          },
          teacher_profile: {
            email: 'teacher@example.com',
            firstName: 'Jane',
            lastName: 'Smith'
          }
        }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons/export?includeProfiles=true');
      const response = await GET(request);
      const data = await response.text();

      expect(response.status).toBe(200);
      
      const jsonData = JSON.parse(data);
      expect(jsonData.filters.includeProfiles).toBe(true);
      expect(jsonData.lessons[0].profile).toBeDefined();
      expect(jsonData.lessons[0].teacher_profile).toBeDefined();
    });

    it('should return 400 for unsupported export format', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock the query chain to prevent the 500 error
      mockSupabase.from.mockReturnValue(createThenableQueryChain([]));

      const request = new NextRequest('http://localhost:3000/api/lessons/export?format=xml');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Unsupported export format');
    });

    it('should return 401 when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/lessons/export');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle empty results', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain([]));

      const request = new NextRequest('http://localhost:3000/api/lessons/export');
      const response = await GET(request);
      const data = await response.text();

      expect(response.status).toBe(200);
      
      const jsonData = JSON.parse(data);
      expect(jsonData.totalLessons).toBe(0);
      expect(jsonData.lessons).toEqual([]);
    });

    it('should handle database errors', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(null, { message: 'Database error' }));

      const request = new NextRequest('http://localhost:3000/api/lessons/export');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error');
    });

    it('should handle CSV export with no lessons', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain([]));

      const request = new NextRequest('http://localhost:3000/api/lessons/export?format=csv');
      const response = await GET(request);
      const data = await response.text();

      expect(response.status).toBe(200);
      expect(data).toBe('No lessons found');
    });

    it('should include all filters in JSON export', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        {
          id: 'lesson-1',
          title: 'Guitar Basics',
          student_id: 'student-1',
          teacher_id: 'teacher-1',
          date: '2024-01-15T10:00:00Z',
          status: 'SCHEDULED'
        }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons/export?userId=user123&status=SCHEDULED&dateFrom=2024-01-01&dateTo=2024-12-31&includeSongs=true&includeProfiles=true');
      const response = await GET(request);
      const data = await response.text();

      expect(response.status).toBe(200);
      
      const jsonData = JSON.parse(data);
      expect(jsonData.filters).toEqual({
        userId: 'user123',
        status: 'SCHEDULED',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
        includeSongs: true,
        includeProfiles: true
      });
    });
  });
}); 