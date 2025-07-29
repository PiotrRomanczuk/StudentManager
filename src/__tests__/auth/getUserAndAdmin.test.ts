import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getUserAndAdmin } from '@/utils/auth-helpers';

// Mock the Supabase server client
jest.mock('@/utils/supabase/clients/server', () => ({
  createClient: jest.fn(),
}));

describe('getUserAndAdmin', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a fresh mock for each test
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(),
    };

    const { createClient } = require('@/utils/supabase/clients/server');
    createClient.mockResolvedValue(mockSupabase);
  });

  it('should return user and admin status when profile exists', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockProfile = { id: 'profile123', user_id: 'user123', isAdmin: true };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock the chain for profile check
    const mockSingle = jest.fn().mockResolvedValue({
      data: mockProfile,
      error: null,
    });
    
    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });
    
    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });
    
    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    mockSupabase.from.mockReturnValue(mockFrom());

    const result = await getUserAndAdmin();

    expect(result).toEqual({
      user: mockUser,
      isAdmin: true,
    });
  });

  it('should throw error when profile does not exist', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock the chain for profile check (profile not found)
    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: { code: 'PGRST116', message: 'No rows returned' },
    });
    
    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });
    
    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });
    
    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    mockSupabase.from.mockReturnValue(mockFrom());

    await expect(getUserAndAdmin()).rejects.toThrow('Error getting user profile');
  });

  it('should throw error when authentication fails', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Authentication failed'),
    });

    await expect(getUserAndAdmin()).rejects.toThrow('Authentication required');
  });

  it('should throw error when no user ID is found', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    await expect(getUserAndAdmin()).rejects.toThrow('Authentication required');
  });

  it('should throw error when profile check fails', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock the chain for profile check with error
    const mockSingle = jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Database connection error'),
    });
    
    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });
    
    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });
    
    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    mockSupabase.from.mockReturnValue(mockFrom());

    await expect(getUserAndAdmin()).rejects.toThrow('Error getting user profile');
  });

  it('should return non-admin when profile exists but isAdmin is false', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockProfile = { id: 'profile123', user_id: 'user123', isAdmin: false };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock the chain for profile check
    const mockSingle = jest.fn().mockResolvedValue({
      data: mockProfile,
      error: null,
    });
    
    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });
    
    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });
    
    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    mockSupabase.from.mockReturnValue(mockFrom());

    const result = await getUserAndAdmin();

    expect(result).toEqual({
      user: mockUser,
      isAdmin: false,
    });
  });

  it('should return false for isAdmin when profile exists but isAdmin is null', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    const mockProfile = { id: 'profile123', user_id: 'user123', isAdmin: null };

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // Mock the chain for profile check
    const mockSingle = jest.fn().mockResolvedValue({
      data: mockProfile,
      error: null,
    });
    
    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });
    
    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });
    
    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    mockSupabase.from.mockReturnValue(mockFrom());

    const result = await getUserAndAdmin();

    expect(result).toEqual({
      user: mockUser,
      isAdmin: false,
    });
  });
}); 