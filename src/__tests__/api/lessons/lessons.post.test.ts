import { NextRequest } from 'next/server';
import { POST } from '@/app/api/(main)/lessons/create/route';
import { createClient } from '@/utils/supabase/clients/server';
import { expect } from '@jest/globals';

// Mock the Supabase client
jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(),
}));

describe('/api/lessons - POST', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(),
      rpc: jest.fn(),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/lessons/create', () => {
    it('should create a lesson with valid data', async () => {
      const mockUser = { id: 'teacher123', email: 'teacher@example.com' };
      const mockProfile = { role: 'teacher' };
      const mockLesson = {
        id: '1',
        lesson_number: 1,
        student_id: 'student123',
        teacher_id: 'teacher123',
        date: '2024-01-01',
        time: '10:00',
        status: 'SCHEDULED',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock profile query
      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
      };

      // Mock RPC call for lesson number
      mockSupabase.rpc.mockResolvedValue({
        data: 1,
        error: null,
      });

      // Mock lesson insert query
      const mockInsertQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockLesson, error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockProfileQuery) // First call for profile
        .mockReturnValueOnce(mockInsertQuery); // Second call for lesson insert

      const request = new NextRequest('http://localhost:3000/api/lessons/create', {
        method: 'POST',
        body: JSON.stringify({
          teacherId: 'teacher123',
          studentId: 'student123',
          date: '2024-01-01',
          time: '10:00',
          title: 'Test Lesson',
          notes: 'Test notes',
          status: 'SCHEDULED',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockLesson);
    });
  });
}); 