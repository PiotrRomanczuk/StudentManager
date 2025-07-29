import { isUserAdmin, getUserAndAdminStatus } from '@/utils/auth-helpers';

// Mock the Supabase server client
jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(),
}));

describe('Admin Check Security', () => {
  const mockSupabaseClient = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { createClient } = require('@/utils/supabase/clients/server');
    createClient.mockResolvedValue(mockSupabaseClient);
  });

  describe('isUserAdmin security', () => {
    it('should prevent users from checking admin status of other users', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Try to check admin status for a different user
      const result = await isUserAdmin('different-user-id');

      expect(result).toBe(false);
    });

    it('should return false when user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await isUserAdmin('user-123');

      expect(result).toBe(false);
    });

    it('should return false when auth error occurs', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Auth error'),
      });

      const result = await isUserAdmin('user-123');

      expect(result).toBe(false);
    });
  });

  describe('getUserAndAdminStatus security', () => {
    it('should handle profile fetch errors gracefully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock the chained methods properly
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: new Error('Profile not found'),
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      });

      const result = await getUserAndAdminStatus();

      expect(result).toStrictEqual({
        user: mockUser,
        isAdmin: false,
      });
    });

    it('should return null user when not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await getUserAndAdminStatus();

      expect(result).toStrictEqual({
        user: null,
        isAdmin: false,
      });
    });
  });
}); 