import '@testing-library/jest-dom';
import { GET } from '@/app/api/(main)/user/route';
import { expect } from '@jest/globals';

// Mock Supabase client with method chaining for profiles
const mockSupabase: any = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => mockSupabase),
  select: jest.fn(() => mockSupabase),
  eq: jest.fn(() => mockSupabase),
  single: jest.fn(),
};

jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

describe('/api/user - GET', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return user data and isAdmin: true when admin check succeeds', async () => {
      const mockUser = {
        id: 'user123',
        email: 'admin@example.com',
        user_metadata: { role: 'admin' },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      mockSupabase.from.mockReturnValue(mockSupabase);
      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({
        data: { isAdmin: true },
        error: null,
      });

      const response = await GET(new Request('http://localhost:3000/api/user'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockUser);
      expect(data.isAdmin).toBe(true);
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    });

    it('should return user data and isAdmin: false when admin check fails', async () => {
      const mockUser = {
        id: 'user123',
        email: 'user@example.com',
        user_metadata: { role: 'user' },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      mockSupabase.from.mockReturnValue(mockSupabase);
      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({
        data: { isAdmin: false },
        error: null,
      });

      const response = await GET(new Request('http://localhost:3000/api/user'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockUser);
      expect(data.isAdmin).toBe(false);
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    });

    it('should return 401 when authentication fails', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Authentication error' },
      });

      const response = await GET(new Request('http://localhost:3000/api/user'));
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication error');
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    });

    it('should return 401 when no user is found', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const response = await GET(new Request('http://localhost:3000/api/user'));
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('No authenticated user found');
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    });

    it('should handle unexpected errors gracefully', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      const response = await GET(new Request('http://localhost:3000/api/user'));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle admin getUserById error and return isAdmin: false', async () => {
      const mockUser = {
        id: 'user123',
        email: 'user@example.com',
        user_metadata: { role: 'user' },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      mockSupabase.from.mockReturnValue(mockSupabase);
      mockSupabase.select.mockReturnValue(mockSupabase);
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Admin service unavailable' },
      });

      const response = await GET(new Request('http://localhost:3000/api/user'));
      const data = await response.json();

      expect(response.status).toBe(200); // The handler should treat admin check error as isAdmin: false
      expect(data.user).toEqual(mockUser);
      expect(data.isAdmin).toBe(false);
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    });

    it('should handle non-Error exceptions', async () => {
      mockSupabase.auth.getUser.mockRejectedValue('String error');

      const response = await GET(new Request('http://localhost:3000/api/user'));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
}); 