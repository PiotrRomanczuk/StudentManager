/**
 * @jest-environment node
 */
import '@testing-library/jest-dom';
import { PATCH } from '@/app/api/(main)/user/route';
import { NextRequest } from 'next/server';
import { expect } from '@jest/globals';

// Mock fetch globally
global.fetch = jest.fn();

// Mock the Supabase client
jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
    })),
  })),
}));

// Mock next/headers to prevent cookies error
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'mock-cookie-value' })),
    getAll: jest.fn(() => [{ name: 'mock-cookie', value: 'mock-cookie-value' }]),
  })),
}));

describe('/api/user - PATCH (User Edit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PATCH - User Profile Update', () => {
    it('should allow user to update their own profile', async () => {
      const mockUser = {
        id: 'user123',
        email: 'user@example.com',
      };

      const updateData = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Updated bio',
      };

      // Mock the fetch call to the user-and-admin endpoint
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: mockUser,
          isAdmin: false,
        }),
      });

      // Mock successful profile update
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      const mockFrom = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { ...updateData, user_id: mockUser.id },
                error: null,
              }),
            })),
          })),
        })),
      }));
      mockSupabase.from = mockFrom;

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expect.objectContaining(updateData));
    });

    it('should allow admin to update any user profile', async () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@example.com',
      };

      const updateData = {
        userId: 'user456',
        firstName: 'Jane',
        lastName: 'Smith',
        isActive: false,
      };

      // Mock the fetch call to the user-and-admin endpoint
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: mockUser,
          isAdmin: true,
        }),
      });

      // Mock successful profile update
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      const mockFrom = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { ...updateData, user_id: updateData.userId },
                error: null,
              }),
            })),
          })),
        })),
      }));
      mockSupabase.from = mockFrom;

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(expect.objectContaining(updateData));
    });

    it('should return 403 when non-admin tries to update another user', async () => {
      const mockUser = {
        id: 'user123',
        email: 'user@example.com',
      };

      const updateData = {
        userId: 'other456',
        firstName: 'Jane',
      };

      // Mock the fetch call to the user-and-admin endpoint
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: mockUser,
          isAdmin: false,
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Unauthorized: Can only update own profile');
    });

    it('should return 401 when authentication fails', async () => {
      // Mock the fetch call to return an error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: 'Authentication error',
        }),
      });

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify({ firstName: 'John' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication error');
    });

    it('should handle database update errors', async () => {
      const mockUser = {
        id: 'user123',
        email: 'user@example.com',
      };

      // Mock the fetch call to the user-and-admin endpoint
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: mockUser,
          isAdmin: false,
        }),
      });

      // Mock database error
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      const mockFrom = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database constraint violation' },
              }),
            })),
          })),
        })),
      }));
      mockSupabase.from = mockFrom;

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify({ firstName: 'John' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database constraint violation');
    });

    it('should handle invalid JSON in request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: 'invalid json',
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle unexpected errors', async () => {
      // Mock the fetch call to throw an error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Unexpected error'));

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify({ firstName: 'John' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
}); 