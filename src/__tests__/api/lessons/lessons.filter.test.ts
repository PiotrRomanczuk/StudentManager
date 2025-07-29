import '@testing-library/jest-dom';
import { GET } from '@/app/api/(main)/lessons/route';
import { expect } from '@jest/globals';
import { NextRequest } from 'next/server';

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
  chain.order = jest.fn(() => chain);
  chain.or = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve(returnValue));
  chain.insert = jest.fn(() => chain);
  chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue)); // for await
  return chain;
};

function createMockNextRequest(url: string): NextRequest {
  return {
    url,
    nextUrl: new URL(url),
  } as unknown as NextRequest;
}

describe('/api/lessons - Filtering and Sorting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from.mockReset();
  });

  describe('Filtering by userId', () => {
    it('should filter lessons by student_id when userId is provided', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          lesson_number: 1, 
          student_id: '550e8400-e29b-41d4-a716-446655440002', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-01T00:00:00.000Z', 
          time: '10:00', 
          status: 'SCHEDULED',
          profile: null,
          teacher_profile: null
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: mockLessons,
        error: null,
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons?userId=user123');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });

    it('should filter lessons by teacher_id when userId is provided', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          lesson_number: 1, 
          student_id: '550e8400-e29b-41d4-a716-446655440004', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440005', 
          date: '2024-01-01T00:00:00.000Z', 
          time: '10:00', 
          status: 'SCHEDULED',
          profile: null,
          teacher_profile: null
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: mockLessons,
        error: null,
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons?userId=user123');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });
  });

  describe('Filtering by status', () => {
    it('should filter lessons by status when filter parameter is provided', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          lesson_number: 1, 
          student_id: '550e8400-e29b-41d4-a716-446655440002', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-01T00:00:00.000Z', 
          time: '10:00', 
          status: 'COMPLETED',
          profile: null,
          teacher_profile: null
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: mockLessons,
        error: null,
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons?filter=COMPLETED');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });

    it('should not filter when filter is "all"', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          lesson_number: 1, 
          student_id: '550e8400-e29b-41d4-a716-446655440002', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-01T00:00:00.000Z', 
          time: '10:00', 
          status: 'SCHEDULED',
          profile: null,
          teacher_profile: null
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440004', 
          lesson_number: 2, 
          student_id: '550e8400-e29b-41d4-a716-446655440005', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-02T00:00:00.000Z', 
          time: '11:00', 
          status: 'COMPLETED',
          profile: null,
          teacher_profile: null
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: mockLessons,
        error: null,
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons?filter=all');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });
  });

  describe('Sorting', () => {
    it('should sort lessons by created_at by default', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          lesson_number: 1, 
          student_id: '550e8400-e29b-41d4-a716-446655440002', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-01T00:00:00.000Z', 
          time: '10:00', 
          status: 'SCHEDULED',
          profile: null,
          teacher_profile: null
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440004', 
          lesson_number: 2, 
          student_id: '550e8400-e29b-41d4-a716-446655440005', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-02T00:00:00.000Z', 
          time: '11:00', 
          status: 'COMPLETED',
          profile: null,
          teacher_profile: null
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: mockLessons,
        error: null,
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });

    it('should sort lessons by date when sort=date is provided', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          lesson_number: 1, 
          student_id: '550e8400-e29b-41d4-a716-446655440002', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-01T00:00:00.000Z', 
          time: '10:00', 
          status: 'SCHEDULED',
          profile: null,
          teacher_profile: null
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440004', 
          lesson_number: 2, 
          student_id: '550e8400-e29b-41d4-a716-446655440005', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-02T00:00:00.000Z', 
          time: '11:00', 
          status: 'COMPLETED',
          profile: null,
          teacher_profile: null
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: mockLessons,
        error: null,
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons?sort=date');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });

    it('should sort lessons by lesson_number when sort=lesson_number is provided', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          lesson_number: 1, 
          student_id: '550e8400-e29b-41d4-a716-446655440002', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-01T00:00:00.000Z', 
          time: '10:00', 
          status: 'SCHEDULED',
          profile: null,
          teacher_profile: null
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440004', 
          lesson_number: 2, 
          student_id: '550e8400-e29b-41d4-a716-446655440005', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-02T00:00:00.000Z', 
          time: '11:00', 
          status: 'COMPLETED',
          profile: null,
          teacher_profile: null
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: mockLessons,
        error: null,
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons?sort=lesson_number');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });
  });

  describe('Combined filtering and sorting', () => {
    it('should handle both userId filter and sort parameter', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          lesson_number: 1, 
          student_id: '550e8400-e29b-41d4-a716-446655440006', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-01T00:00:00.000Z', 
          time: '10:00', 
          status: 'SCHEDULED',
          profile: null,
          teacher_profile: null
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440004', 
          lesson_number: 2, 
          student_id: '550e8400-e29b-41d4-a716-446655440006', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-02T00:00:00.000Z', 
          time: '11:00', 
          status: 'COMPLETED',
          profile: null,
          teacher_profile: null
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: mockLessons,
        error: null,
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons?userId=user123&sort=date');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });

    it('should handle status filter and sort parameter', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockLessons = [
        { 
          id: '550e8400-e29b-41d4-a716-446655440001', 
          lesson_number: 1, 
          student_id: '550e8400-e29b-41d4-a716-446655440002', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-01T00:00:00.000Z', 
          time: '10:00', 
          status: 'COMPLETED',
          profile: null,
          teacher_profile: null
        },
        { 
          id: '550e8400-e29b-41d4-a716-446655440004', 
          lesson_number: 2, 
          student_id: '550e8400-e29b-41d4-a716-446655440005', 
          teacher_id: '550e8400-e29b-41d4-a716-446655440003', 
          date: '2024-01-02T00:00:00.000Z', 
          time: '11:00', 
          status: 'COMPLETED',
          profile: null,
          teacher_profile: null
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: mockLessons,
        error: null,
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons?filter=COMPLETED&sort=date');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.lessons).toEqual(mockLessons);
    });
  });
}); 