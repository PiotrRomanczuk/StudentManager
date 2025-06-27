/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/assignements/route';

// Mock Supabase client
jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    },
  })),
}));

describe('/api/assignements', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return tasks when authenticated', async () => {
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ 
            data: [
              { id: 1, title: 'Task 1', description: 'Description 1' },
              { id: 2, title: 'Task 2', description: 'Description 2' }
            ], 
            error: null 
          }),
        }),
      });

      const request = new NextRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toBeDefined();
      expect(Array.isArray(data.tasks)).toBe(true);
    });

    it('should handle database errors gracefully', async () => {
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Database connection failed' } 
          }),
        }),
      });

      const request = new NextRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
      expect(data.error).toContain('Database connection failed');
    });
  });

  describe('POST', () => {
    it('should create a task with valid data', async () => {
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ 
            data: { 
              id: 1, 
              title: 'New Task', 
              description: 'New Description',
              teacher_id: 1,
              student_id: 2
            }, 
            error: null 
          }),
        }),
      });
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      });

      const request = new NextRequest('http://localhost:3000/api/assignements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Task',
          description: 'New Description',
          teacher_id: 1,
          student_id: 2,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.task).toBeDefined();
      expect(data.task.title).toBe('New Task');
      expect(mockInsert).toHaveBeenCalledWith([{
        title: 'New Task',
        description: 'New Description',
        teacher_id: 1,
        student_id: 2,
      }]);
    });

    it('should return 400 for missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/assignements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Task',
          // Missing teacher_id and student_id
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(data.error).toContain('Missing required fields');
    });

    it('should handle database errors during creation', async () => {
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ 
              data: null, 
              error: { message: 'Insert failed' } 
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/assignements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Task',
          description: 'New Description',
          teacher_id: 1,
          student_id: 2,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
      expect(data.error).toContain('Insert failed');
    });
  });
}); 