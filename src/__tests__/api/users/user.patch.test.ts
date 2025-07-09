import '@testing-library/jest-dom';
import { PATCH } from '@/app/api/(main)/user/route';
import { expect } from '@jest/globals';
import { NextRequest } from 'next/server';

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    admin: {
      getUserById: jest.fn(),
    },
  },
  from: jest.fn(),
};

jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

jest.mock('@/app/dashboard/utils/getUserAndAdmin', () => ({
  getUserAndAdmin: jest.fn(),
}));

import { getUserAndAdmin } from '@/app/dashboard/utils/getUserAndAdmin';

describe('/api/user - PATCH', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PATCH', () => {
    it('should update user isActive status when admin', async () => {
      (getUserAndAdmin as jest.Mock).mockResolvedValue({
        user: { id: 'admin-user' },
        isAdmin: true,
      });

      const mockUpdatedUser = {
        id: 1,
        user_id: 'user123',
        isActive: false,
      };

      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockUpdatedUser, error: null }),
      };

      mockSupabase.from.mockReturnValue(mockUpdateQuery);

      const requestBody = {
        userId: 'user123',
        isActive: false,
      };

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user).toEqual(mockUpdatedUser);
      expect(data.message).toBe('User deactivated successfully');
    });

    it('should return 403 when non-admin tries to update user', async () => {
      (getUserAndAdmin as jest.Mock).mockResolvedValue({
        user: { id: 'regular-user' },
        isAdmin: false,
      });

      const requestBody = {
        userId: 'user123',
        isActive: false,
      };

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Unauthorized: Admin access required');
    });

    it('should return 400 for missing required fields', async () => {
      (getUserAndAdmin as jest.Mock).mockResolvedValue({
        user: { id: 'admin-user' },
        isAdmin: true,
      });

      const requestBody = {
        userId: 'user123',
        // Missing isActive
      };

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields: userId and isActive');
    });

    it('should handle database errors', async () => {
      (getUserAndAdmin as jest.Mock).mockResolvedValue({
        user: { id: 'admin-user' },
        isAdmin: true,
      });

      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
      };

      mockSupabase.from.mockReturnValue(mockUpdateQuery);

      const requestBody = {
        userId: 'user123',
        isActive: false,
      };

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error');
    });

    it('should handle unexpected errors', async () => {
      (getUserAndAdmin as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      const requestBody = {
        userId: 'user123',
        isActive: false,
      };

      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });

      const response = await PATCH(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Unexpected error');
    });
  });
}); 