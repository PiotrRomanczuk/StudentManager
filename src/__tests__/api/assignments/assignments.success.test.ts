import '@testing-library/jest-dom';
import { GET, POST } from '@/app/api/(main)/assignments/route';
import { expect } from '@jest/globals';
import { NextRequest } from 'next/server';

const mockSupabase = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-id' } }, error: null }),
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

const createMockRequest = (url: string, body?: any): NextRequest => {
  const mockRequest = {
    url,
    json: jest.fn().mockResolvedValue(body || {}),
  } as unknown as NextRequest;
  return mockRequest;
};

describe('/api/assignments - Success', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from.mockReset();
  });

  it('should return tasks when authenticated', async () => {
    const mockData = {
      data: [
        { id: 1, title: 'Task 1', description: 'Description 1' },
        { id: 2, title: 'Task 2', description: 'Description 2' }
      ],
      error: null
    };
    mockSupabase.from.mockReturnValue(createChainedMock(mockData));
    const request = createMockRequest('http://localhost:3000/api/assignments');
    const response = await GET(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.tasks).toBeDefined();
    expect(Array.isArray(data.tasks)).toBe(true);
  });

  it('should create a task with valid data', async () => {
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
}); 