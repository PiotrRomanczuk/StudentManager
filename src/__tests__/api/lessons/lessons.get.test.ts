import { NextRequest } from 'next/server';
import { GET } from '@/app/api/(main)/lessons/route';
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
    order: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
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

describe('/api/lessons - GET', () => {
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

  describe('GET /api/lessons', () => {
    it('should return all lessons when no filters are provided', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { id: '1', lesson_number: 1, student_id: 'student1', teacher_id: 'teacher1', date: '2024-01-01', time: '10:00', status: 'SCHEDULED' },
        { id: '2', lesson_number: 2, student_id: 'student2', teacher_id: 'teacher1', date: '2024-01-02', time: '11:00', status: 'COMPLETED' },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });

    it('should return filtered lessons when userId is provided', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { id: '1', lesson_number: 1, student_id: 'user123', teacher_id: 'teacher1', date: '2024-01-01', time: '10:00', status: 'SCHEDULED' },
      ];
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons?userId=user123');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });

    it('should return sorted lessons when sort parameter is provided', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { id: '1', lesson_number: 1, student_id: 'student1', teacher_id: 'teacher1', date: '2024-01-01', time: '10:00', status: 'SCHEDULED' },
        { id: '2', lesson_number: 2, student_id: 'student2', teacher_id: 'teacher1', date: '2024-01-02', time: '11:00', status: 'COMPLETED' },
      ];
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons));

      const request = new NextRequest('http://localhost:3000/api/lessons?sort=date');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });
  });
}); 