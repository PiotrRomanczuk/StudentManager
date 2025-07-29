import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';

// Mock the Supabase client
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
        order: jest.fn(() => ({
          order: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
    })),
  }),
};

jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

// Mock fetch for internal API calls
global.fetch = jest.fn();

describe('Admin User Management API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/user-management', () => {
    it('should return all users when admin is authenticated', async () => {
      // Mock admin user
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'admin-user-id', email: 'admin@test.com' } },
        error: null,
      });

      // Mock admin profile
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { isAdmin: true },
              error: null,
            }),
          })),
        })),
      });

      // Mock users data
      const mockUsers = [
        {
          id: 1,
          user_id: 'user-1',
          email: 'student1@test.com',
          firstName: 'John',
          lastName: 'Doe',
          isStudent: true,
          isActive: true,
        },
        {
          id: 2,
          user_id: 'user-2',
          email: 'student2@test.com',
          firstName: 'Jane',
          lastName: 'Smith',
          isStudent: true,
          isActive: true,
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          order: jest.fn().mockResolvedValue({
            data: mockUsers,
            error: null,
          }),
        })),
      });

      const { GET } = await import('@/app/api/admin/user-management/route');
      const request = new Request('http://localhost:3000/api/admin/user-management');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toEqual(mockUsers);
    });

    it('should return 401 when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const { GET } = await import('@/app/api/admin/user-management/route');
      const request = new Request('http://localhost:3000/api/admin/user-management');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 403 when user is not admin', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-id', email: 'user@test.com' } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { isAdmin: false },
              error: null,
            }),
          })),
        })),
      });

      const { GET } = await import('@/app/api/admin/user-management/route');
      const request = new Request('http://localhost:3000/api/admin/user-management');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Admin access required');
    });
  });

  describe('PATCH /api/admin/user-management', () => {
    it('should update user profile when admin is authenticated', async () => {
      // Mock admin user
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'admin-user-id', email: 'admin@test.com' } },
        error: null,
      });

      // Mock admin profile
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { isAdmin: true },
              error: null,
            }),
          })),
        })),
      });

      // Mock updated profile
      const updatedProfile = {
        id: 1,
        user_id: 'user-1',
        email: 'student1@test.com',
        firstName: 'John Updated',
        lastName: 'Doe',
        isStudent: true,
        isActive: true,
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: updatedProfile,
                error: null,
              }),
            })),
          })),
        })),
      });

      const { PATCH } = await import('@/app/api/admin/user-management/route');
      const request = new NextRequest('http://localhost:3000/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify({
          user_id: 'user-1',
          firstName: 'John Updated',
        }),
      });
      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(updatedProfile);
    });

    it('should return 403 when non-admin tries to update user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-id', email: 'user@test.com' } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { isAdmin: false },
              error: null,
            }),
          })),
        })),
      });

      const { PATCH } = await import('@/app/api/admin/user-management/route');
      const request = new NextRequest('http://localhost:3000/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify({
          user_id: 'user-1',
          firstName: 'John Updated',
        }),
      });
      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Admin access required');
    });

    it('should return 400 when user_id is missing', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'admin-user-id', email: 'admin@test.com' } },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { isAdmin: true },
              error: null,
            }),
          })),
        })),
      });

      const { PATCH } = await import('@/app/api/admin/user-management/route');
      const request = new NextRequest('http://localhost:3000/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify({
          firstName: 'John Updated',
        }),
      });
      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('User ID is required');
    });
  });
}); 