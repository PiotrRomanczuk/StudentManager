import { NextRequest } from 'next/server';
import { PUT } from '@/app/api/(main)/lessons/[id]/route';
import { createClient } from '@/utils/supabase/clients/server';
import { expect } from '@jest/globals';

// Mock the Supabase client
jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(),
}));

describe('/api/lessons - PUT', () => {
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

  describe('PUT /api/lessons/[id]', () => {
    it('should update a lesson with valid data', async () => {
      const mockUser = { id: '550e8400-e29b-41d4-a716-446655440003', email: 'teacher@example.com' };
      const mockProfile = { role: 'teacher' };
      const mockLesson = {
        id: '550e8400-e29b-41d4-a716-446655440001',
        lesson_number: 2,
        student_id: '550e8400-e29b-41d4-a716-446655440002',
        teacher_id: '550e8400-e29b-41d4-a716-446655440003',
        date: '2024-01-01T00:00:00.000Z',
        time: '11:00',
        status: 'COMPLETED',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockProfileQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
      };

      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockLesson, error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockProfileQuery)
        .mockReturnValueOnce(mockUpdateQuery);

      const request = new NextRequest('http://localhost:3000/api/lessons/550e8400-e29b-41d4-a716-446655440001', {
        method: 'PUT',
        body: JSON.stringify({
          title: 'Updated Lesson',
          notes: 'Updated notes',
          date: '2024-01-01T00:00:00.000Z',
          time: '11:00',
          status: 'COMPLETED',
        }),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: '550e8400-e29b-41d4-a716-446655440001' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockLesson);
    });
  });
}); 