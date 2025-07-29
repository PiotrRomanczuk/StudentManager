import { NextRequest } from 'next/server';
import { GET } from '@/app/api/(main)/lessons/route';
import { expect } from '@jest/globals';

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
};

jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

describe('/api/lessons - Student Filter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for invalid studentId format', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock the Supabase query chain
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    };
    mockSupabase.from.mockReturnValue(mockQuery);

    // Create a request with invalid studentId (numeric instead of UUID)
    const request = new NextRequest('http://localhost:3000/api/lessons?studentId=40');
    const response = await GET(request);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid student ID format');
  });

  it('should accept valid UUID studentId', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockLessons = [
      {
        id: 'lesson-1',
        student_id: '550e8400-e29b-41d4-a716-446655440001',
        teacher_id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Test Lesson',
        status: 'SCHEDULED'
      }
    ];
    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockLessons,
        error: null,
      }),
    });

    // Create a request with valid UUID studentId
    const request = new NextRequest('http://localhost:3000/api/lessons?studentId=550e8400-e29b-41d4-a716-446655440001');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.lessons).toBeDefined();
  });
}); 