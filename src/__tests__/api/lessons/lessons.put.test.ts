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
      const mockUser = { id: 'teacher123', email: 'teacher@example.com' };
      const mockProfile = { role: 'teacher' };
      const mockLesson = {
        id: '1',
        lesson_number: 2,
        student_id: 'student123',
        teacher_id: 'teacher123',
        date: '2024-01-01',
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

      const request = new NextRequest('http://localhost:3000/api/lessons/1', {
        method: 'PUT',
        body: JSON.stringify({
          title: 'Updated Lesson',
          notes: 'Updated notes',
          date: '2024-01-01',
          time: '11:00',
          status: 'COMPLETED',
        }),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: '1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockLesson);
    });
  });
}); 