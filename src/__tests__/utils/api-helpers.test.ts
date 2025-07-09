import '@testing-library/jest-dom';
import { APIError, fetchApi } from '@/utils/api-helpers';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Helper Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('APIError', () => {
    it('should create APIError with correct properties', () => {
      const error = new APIError('Test error', 400, 'VALIDATION_ERROR');
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('APIError');
    });

    it('should create APIError without code', () => {
      const error = new APIError('Test error', 500);
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(500);
      expect(error.code).toBeUndefined();
    });
  });

  describe('fetchApi', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchApi('/api/test');
      
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith('/api/test', undefined);
    });

    it('should handle API errors with status code', async () => {
      const errorResponse = { message: 'Not found', code: 'NOT_FOUND' };
      
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve(errorResponse),
      });

      await expect(fetchApi('/api/test')).rejects.toThrow(APIError);
      
      try {
        await fetchApi('/api/test');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect((error as APIError).message).toBe('Not found');
        expect((error as APIError).status).toBe(404);
        expect((error as APIError).code).toBe('NOT_FOUND');
      }
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(fetchApi('/api/test')).rejects.toThrow(APIError);
      
      try {
        await fetchApi('/api/test');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect((error as APIError).message).toBe('Network error');
        expect((error as APIError).status).toBe(500);
      }
    });

    it('should handle API errors without message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });

      try {
        await fetchApi('/api/test');
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect((error as APIError).message).toBe('An error occurred');
        expect((error as APIError).status).toBe(500);
      }
    });

    it('should pass options to fetch', async () => {
      const mockData = { success: true };
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'data' }),
      };
      
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      await fetchApi('/api/test', options);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/test', options);
    });
  });
}); 