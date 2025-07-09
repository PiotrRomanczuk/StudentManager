import '@testing-library/jest-dom';
import { POST } from '@/app/api/(main)/assignments/route';
import { expect } from '@jest/globals';
import { NextRequest } from 'next/server';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-id' } }, error: null }),
  },
};

jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

// Helper function to create chained mocks
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

// Mock NextRequest
const createMockRequest = (url: string, body?: any): NextRequest => {
  const mockRequest = {
    url,
    json: jest.fn().mockResolvedValue(body || {}),
  } as unknown as NextRequest;
  
  return mockRequest;
};

describe('/api/assignments - POST', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from.mockReset();
  });

  describe('POST', () => {
    it('should create a task with valid data', async () => {
      // Mock profile check
      const profileData = {
        data: { role: 'teacher' },
        error: null
      };
      
      const taskData = {
        data: {
          id: 1,
          title: 'New Task',
          description: 'New Description',
          teacher_id: 1,
          student_id: 2
        },
        error: null
      };
      
      // Mock to handle both profile and task operations
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return createChainedMock(profileData);
        }
        return createChainedMock(taskData);
      });

      const requestBody = {
        title: 'New Task',
        description: 'New Description',
        teacher_id: 1,
        student_id: 2,
      };

      const request = createMockRequest('http://localhost:3000/api/assignments', requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe('New Task');
    });

    it('should return 400 for missing required fields', async () => {
      const requestBody = {
        title: 'New Task',
        // Missing teacher_id and student_id
      };
      // Mock profile lookup to return a valid teacher profile
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return createChainedMock({ data: { role: 'teacher' }, error: null });
        }
        return createChainedMock({});
      });
      const request = createMockRequest('http://localhost:3000/api/assignments', requestBody);
      const response = await POST(request);
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 403 for non-admin/non-teacher users', async () => {
      const profileData = {
        data: { role: 'student' },
        error: null
      };
      mockSupabase.from.mockReturnValue(createChainedMock(profileData));

      const requestBody = {
        title: 'New Task',
        teacher_id: 1,
        student_id: 2,
      };

      const request = createMockRequest('http://localhost:3000/api/assignments', requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden');
    });

    it('should handle database errors during creation', async () => {
      const profileData = {
        data: { role: 'teacher' },
        error: null
      };
      
      const taskData = {
        data: null,
        error: { message: 'Insert failed' }
      };
      
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return createChainedMock(profileData);
        }
        return createChainedMock(taskData);
      });

      const requestBody = {
        title: 'New Task',
        description: 'New Description',
        teacher_id: 1,
        student_id: 2,
      };

      const request = createMockRequest('http://localhost:3000/api/assignments', requestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
      expect(data.error).toBe('Insert failed');
    });
  });
}); 