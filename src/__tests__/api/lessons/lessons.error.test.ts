import '@testing-library/jest-dom';
import { GET } from '@/app/api/(main)/lessons/route';
import { POST } from '@/app/api/(main)/lessons/create/route';
import { GET as GET_SINGLE, PUT, DELETE } from '@/app/api/(main)/lessons/[id]/route';
import { expect } from '@jest/globals';
import { NextRequest } from 'next/server';

const mockSupabase = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn(),
  },
  rpc: jest.fn(),
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
  chain.update = jest.fn(() => chain);
  chain.delete = jest.fn(() => chain);
  chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue)); // for await
  return chain;
};

function createMockNextRequest(url: string, method: string = 'GET', body?: any): NextRequest {
  return {
    url,
    method,
    nextUrl: new URL(url),
    json: jest.fn().mockResolvedValue(body || {}),
  } as unknown as NextRequest;
}

describe('/api/lessons - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from.mockReset();
  });

  describe('GET /api/lessons', () => {
    it('should handle database error when fetching lessons', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: null,
        error: { message: 'Database connection failed' },
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database connection failed');
    });

    it('should handle error when fetching filtered lessons', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: null,
        error: { message: 'Filter query failed' },
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons?userId=user123');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Filter query failed');
    });
  });

  describe('GET /api/lessons/[id]', () => {
    it('should return 404 when lesson is not found', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: null,
        error: { code: 'PGRST116', message: 'No rows returned' },
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/nonexistent');
      const response = await GET_SINGLE(mockRequest, { params: Promise.resolve({ id: 'nonexistent' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Lesson not found');
    });

    it('should handle database error when fetching single lesson', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue(createChainedMock({
        data: null,
        error: { message: 'Database error' },
      }));

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/1');
      const response = await GET_SINGLE(mockRequest, { params: Promise.resolve({ id: '1' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error');
    });
  });

  describe('POST /api/lessons/create', () => {
    it('should return 400 when required fields are missing', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const incompleteLesson = {
        teacher_id: '550e8400-e29b-41d4-a716-446655440003',
        // Missing student_id, date, time
        title: 'Test Lesson',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock profile lookup to return admin role
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return createChainedMock({
            data: { role: 'admin' },
            error: null,
          });
        }
        return createChainedMock({});
      });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/create', 'POST', incompleteLesson);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid lesson data');
    });

    it('should handle database error when creating lesson', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const newLesson = {
        teacher_id: '550e8400-e29b-41d4-a716-446655440003',
        student_id: '550e8400-e29b-41d4-a716-446655440002',
        date: '2024-01-01T00:00:00.000Z',
        time: '10:00',
        title: 'Test Lesson',
        status: 'SCHEDULED',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return createChainedMock({
            data: { role: 'admin' },
            error: null,
          });
        }
        return createChainedMock({
          data: null,
          error: { message: 'Insert failed' },
        });
      });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/create', 'POST', newLesson);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Insert failed');
    });
  });

  describe('PUT /api/lessons/[id]', () => {
    it('should return 404 when lesson to update is not found', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const updateData = {
        title: 'Updated Lesson',
        status: 'COMPLETED',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock profile lookup to return admin role
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return createChainedMock({
            data: { role: 'admin' },
            error: null,
          });
        }
        return createChainedMock({
          data: null,
          error: { code: 'PGRST116', message: 'No rows returned' },
        });
      });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/nonexistent', 'PUT', updateData);
      const response = await PUT(mockRequest, { params: Promise.resolve({ id: 'nonexistent' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Lesson not found');
    });

    it('should handle database error when updating lesson', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const updateData = {
        title: 'Updated Lesson',
        status: 'COMPLETED',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock profile lookup to return admin role
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return createChainedMock({
            data: { role: 'admin' },
            error: null,
          });
        }
        return createChainedMock({
          data: null,
          error: { message: 'Update failed' },
        });
      });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/1', 'PUT', updateData);
      const response = await PUT(mockRequest, { params: Promise.resolve({ id: '1' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Update failed');
    });
  });

  describe('DELETE /api/lessons/[id]', () => {
    it('should return 404 when lesson to delete is not found', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock profile lookup to return admin role
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return createChainedMock({
            data: { role: 'admin' },
            error: null,
          });
        }
        return createChainedMock({
          data: null,
          error: { code: 'PGRST116', message: 'No rows returned' },
        });
      });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/nonexistent', 'DELETE');
      const response = await DELETE(mockRequest, { params: Promise.resolve({ id: 'nonexistent' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Lesson not found');
    });

    it('should handle database error when deleting lesson', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock profile lookup to return admin role
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return createChainedMock({
            data: { role: 'admin' },
            error: null,
          });
        }
        return createChainedMock({
          data: null,
          error: { message: 'Delete failed' },
        });
      });

      const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/1', 'DELETE');
      const response = await DELETE(mockRequest, { params: Promise.resolve({ id: '1' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Delete failed');
    });
  });
}); 