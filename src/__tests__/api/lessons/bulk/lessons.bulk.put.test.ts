import { NextRequest } from 'next/server';
import { PUT } from '@/app/api/(main)/lessons/bulk/route';
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
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
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

describe('PUT /api/lessons/bulk', () => {
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

  it('should update multiple lessons successfully', async () => {
    const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
    const mockProfile = { role: 'teacher' };
    const mockUpdatedLesson = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Updated Week 1',
      status: 'COMPLETED',
      student_id: '550e8400-e29b-41d4-a716-446655440002',
      teacher_id: '550e8400-e29b-41d4-a716-446655440003',
      creator_user_id: '550e8400-e29b-41d4-a716-446655440000',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T11:00:00Z'
    };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock the from method to return different chains based on the table name
    mockSupabase.from.mockImplementation((tableName: string) => {
      if (tableName === 'profiles') {
        return createThenableQueryChain(mockProfile);
      } else if (tableName === 'lessons') {
        // Return a chain that will be used for lesson updates
        return createThenableQueryChain(mockUpdatedLesson);
      }
      return createThenableQueryChain(null);
    });

    const requestBody = {
      updates: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Updated Week 1',
          status: 'COMPLETED'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          title: 'Updated Week 2',
          status: 'COMPLETED'
        }
      ]
    };

    const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.updated).toHaveLength(2);
    expect(data.total).toBe(2);
    expect(data.success).toBe(2);
    expect(data.failed).toBe(0);
  });

  it('should handle missing lesson ID in updates', async () => {
    const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
    const mockProfile = { role: 'teacher' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

    const requestBody = {
      updates: [
        {
          title: 'Updated Week 1',
          status: 'COMPLETED'
        }
      ]
    };

    const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(1);
    expect(data.success).toBe(0);
    expect(data.failed).toBe(1);
    expect(data.errors[0].error).toBe('Lesson ID is required');
  });

  it('should handle validation errors in updates', async () => {
    const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
    const mockProfile = { role: 'teacher' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

    const requestBody = {
      updates: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          status: 'INVALID_STATUS' // Invalid status
        }
      ]
    };

    const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(1);
    expect(data.success).toBe(0);
    expect(data.failed).toBe(1);
    expect(data.errors[0].error).toBe('Validation failed');
  });
}); 