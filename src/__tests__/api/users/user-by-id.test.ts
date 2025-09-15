/**
 * @jest-environment node
 */
import '@testing-library/jest-dom';
import { GET, PATCH, DELETE } from '@/app/api/(main)/admin/user/[id]/route';
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
        eq: jest.fn(() => ({
          single: jest.fn(),
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

describe('/api/admin/user/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET - Get User by ID', () => {
    it('should return user profile when admin is authenticated', async () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@example.com',
      };

      const mockUserProfile = {
        user_id: 'user456',
        email: 'user456@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isAdmin: false,
        isActive: true,
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

      // Mock user profile fetch
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockUserProfile,
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user/user456');
      const response = await GET(request, { params: { id: 'user456' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUserProfile);
    });

    it('should return 400 for invalid user ID format', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/user/invalid-id');
      const response = await GET(request, { params: { id: 'invalid-id' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid user ID format');
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock authentication failure
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user/user456');
      const response = await GET(request, { params: { id: 'user456' } });
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

      const request = new NextRequest('http://localhost:3000/api/admin/user/user456');
      const response = await GET(request, { params: { id: 'user456' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Admin access required');
    });

    it('should return 404 when user is not found', async () => {
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

      // Mock user not found
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user/nonexistent');
      const response = await GET(request, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('User not found');
    });
  });

  describe('PATCH - Update User by ID', () => {
    it('should update user when admin is authenticated', async () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@example.com',
      };

      const updateData = {
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

      const request = new NextRequest('http://localhost:3000/api/admin/user/user456', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH(request, { params: { id: 'user456' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(updatedUser);
    });

    it('should return 400 for invalid user ID format', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/user/invalid-id', {
        method: 'PATCH',
        body: JSON.stringify({ firstName: 'John' }),
      });

      const response = await PATCH(request, { params: { id: 'invalid-id' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid user ID format');
    });

    it('should return 400 for invalid request data', async () => {
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

      const invalidData = {
        email: 'invalid-email', // Invalid email format
      };

      const request = new NextRequest('http://localhost:3000/api/admin/user/user456', {
        method: 'PATCH',
        body: JSON.stringify(invalidData),
      });

      const response = await PATCH(request, { params: { id: 'user456' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid request data');
    });
  });

  describe('DELETE - Delete User by ID', () => {
    it('should deactivate user when admin is authenticated', async () => {
      const mockUser = {
        id: 'admin123',
        email: 'admin@example.com',
      };

      const deactivatedUser = {
        user_id: 'user456',
        email: 'user456@example.com',
        firstName: 'John',
        lastName: 'Doe',
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

      // Mock successful deactivation
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: deactivatedUser,
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user/user456', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: 'user456' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('User deactivated successfully');
      expect(data.user).toEqual(deactivatedUser);
    });

    it('should return 400 when admin tries to delete themselves', async () => {
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

      const request = new NextRequest('http://localhost:3000/api/admin/user/admin123', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: 'admin123' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Cannot delete your own account');
    });

    it('should return 400 for invalid user ID format', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/user/invalid-id', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: 'invalid-id' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid user ID format');
    });

    it('should return 401 when user is not authenticated', async () => {
      // Mock authentication failure
      const mockSupabase = require('@/utils/supabase/clients/server').createClient();
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const request = new NextRequest('http://localhost:3000/api/admin/user/user456', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: 'user456' } });
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

      const request = new NextRequest('http://localhost:3000/api/admin/user/user456', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: 'user456' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Admin access required');
    });
  });
}); 