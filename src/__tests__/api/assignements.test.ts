import '@testing-library/jest-dom';
import { GET, POST } from '@/app/api/assignements/route';
import { expect } from '@jest/globals';

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

// Mock request interface
interface MockRequest {
  json: jest.Mock;
}

describe('/api/assignements', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.from.mockReset();
  });

  describe('GET', () => {
    it('should return tasks when authenticated', async () => {
      const selectMock = jest.fn().mockResolvedValue({
        data: [
          { id: 1, title: 'Task 1', description: 'Description 1' },
          { id: 2, title: 'Task 2', description: 'Description 2' }
        ],
        error: null
      });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toBeDefined();
      expect(Array.isArray(data.tasks)).toBe(true);
      expect(selectMock).toHaveBeenCalledWith('*');
    });

    it('should handle database errors gracefully', async () => {
      const selectMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' }
      });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
      expect(data.error).toContain('Database connection failed');
    });
  });

  describe('POST', () => {
    it('should create a task with valid data', async () => {
      const singleMock = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          title: 'New Task',
          description: 'New Description',
          teacher_id: 1,
          student_id: 2
        },
        error: null
      });
      const insertMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: singleMock
        })
      });
      mockSupabase.from.mockReturnValue({ insert: insertMock });

      // Create a simple request object that works in all environments
      const requestBody = {
        title: 'New Task',
        description: 'New Description',
        teacher_id: 1,
        student_id: 2,
      };

      // Mock the request.json() method
      const mockRequest: MockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      };

      const response = await POST(mockRequest as unknown as Request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.task).toBeDefined();
      expect(data.task.title).toBe('New Task');
      expect(insertMock).toHaveBeenCalledWith([{
        title: 'New Task',
        description: 'New Description',
        due_date: undefined,
        teacher_id: 1,
        student_id: 2,
      }]);
    });

    it('should return 400 for missing required fields', async () => {
      // Create a simple request object that works in all environments
      const requestBody = {
        title: 'New Task',
        // Missing teacher_id and student_id
      };

      // Mock the request.json() method
      const mockRequest: MockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      };

      const response = await POST(mockRequest as unknown as Request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(data.error).toContain('Missing required fields');
    });

    it('should handle database errors during creation', async () => {
      const singleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' }
      });
      const insertMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: singleMock
        })
      });
      mockSupabase.from.mockReturnValue({ insert: insertMock });

      // Create a simple request object that works in all environments
      const requestBody = {
        title: 'New Task',
        description: 'New Description',
        teacher_id: 1,
        student_id: 2,
      };

      // Mock the request.json() method
      const mockRequest: MockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      };

      const response = await POST(mockRequest as unknown as Request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
      expect(data.error).toContain('Insert failed');
    });
  });
});