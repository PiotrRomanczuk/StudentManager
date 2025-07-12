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
      const mockUser = { id: '550e8400-e29b-41d4-a716-446655440003', email: 'teacher@example.com' };
      const mockProfile = { role: 'teacher' };
      const mockLesson = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        lesson_number: 1,
        student_id: '550e8400-e29b-41d4-a716-446655440002',
        teacher_id: '550e8400-e29b-41d4-a716-446655440003',
        date: '2024-01-01T00:00:00.000Z',
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
          teacher_id: '550e8400-e29b-41d4-a716-446655440003',
          student_id: '550e8400-e29b-41d4-a716-446655440002',
          date: '2024-01-01T00:00:00.000Z',
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