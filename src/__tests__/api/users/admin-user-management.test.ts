/**
 * @jest-environment node
 */
import '@testing-library/jest-dom';
import { GET, PATCH } from '@/app/api/admin/user-management/route';
import { NextRequest } from 'next/server';
import { expect } from '@jest/globals';

// Mock the Supabase client
jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
          })),
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
  })),
}));

describe('/api/admin/user-management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET - Fetch All Users', () => {
    it('should return all users when admin is authenticated', async () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@example.com',
      };

      const mockUsers = [
        {
          user_id: 'user1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          isAdmin: false,
          isActive: true,
        },
        {
          user_id: 'user2',
          email: 'user2@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          isAdmin: false,
          isActive: true,
        },
      ];

      // Mock authentication
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock admin check
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { isAdmin: true },
        error: null,
      });

      // Mock users fetch
      mockSupabase.from().select().order.mockResolvedValue({
        data: mockUsers,
        error: null,
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toEqual(mockUsers);
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock authentication failure
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 403 when user is not admin', async () => {
      const mockUser = {
        id: 'user123',
        email: 'user@example.com',
      };

      // Mock authentication
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock admin check - user is not admin
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { isAdmin: false },
        error: null,
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Admin access required');
    });

    it('should handle database errors when fetching users', async () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@example.com',
      };

      // Mock authentication
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock admin check
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { isAdmin: true },
        error: null,
      });

      // Mock database error
      mockSupabase.from().select().order.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error fetching users');
    });
  });

  describe('PATCH - Update User', () => {
    it('should update user when admin is authenticated', async () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@example.com',
      };

      const updateData = {
        user_id: 'user456',
        firstName: 'Updated',
        lastName: 'Name',
        isActive: false,
      };

      const updatedUser = {
        user_id: 'user456',
        email: 'user456@example.com',
        firstName: 'Updated',
        lastName: 'Name',
        isActive: false,
      };

      // Mock authentication
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock admin check
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { isAdmin: true },
        error: null,
      });

      // Mock successful update
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: updatedUser,
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(updatedUser);
    });

    it('should return 400 for invalid request data', async () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@example.com',
      };

      const invalidData = {
        // Missing user_id
        firstName: 'John',
      };

      // Mock authentication
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock admin check
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { isAdmin: true },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify(invalidData),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid request data');
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock authentication failure
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify({ user_id: 'user123', firstName: 'John' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 403 when user is not admin', async () => {
      const mockUser = {
        id: 'user123',
        email: 'user@example.com',
      };

      // Mock authentication
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock admin check - user is not admin
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { isAdmin: false },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify({ user_id: 'user123', firstName: 'John' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Admin access required');
    });

    it('should return 400 when user_id is missing', async () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@example.com',
      };

      const updateData = {
        // Missing user_id
        firstName: 'John',
        lastName: 'Doe',
      };

      // Mock authentication
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock admin check
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { isAdmin: true },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('User ID is required');
    });

    it('should handle database update errors', async () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@example.com',
      };

      const updateData = {
        user_id: 'user456',
        firstName: 'John',
      };

      // Mock authentication
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock admin check
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { isAdmin: true },
        error: null,
      });

      // Mock database error
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error: { message: 'Constraint violation' },
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Constraint violation');
    });

    it('should handle unexpected errors', async () => {
      // Mock authentication to throw error
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      const request = new NextRequest('http://localhost:3000/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify({ user_id: 'user123', firstName: 'John' }),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
}); 