import {
	getCurrentUser,
	getCurrentUserWithProfile,
	isUserAdmin,
	requireAuth,
	requireAdmin,
	getUserAndAdminStatus,
} from '@/utils/auth-helpers';

// Mock the Supabase server client
jest.mock('@/utils/supabase/clients/server', () => ({
	createClient: jest.fn(),
}));

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

describe('Auth Helpers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		const { createClient } = require('@/utils/supabase/clients/server');
		createClient.mockResolvedValue(mockSupabaseClient);
	});

	describe('getCurrentUser', () => {
		it('should return user when session is valid', async () => {
			const mockUser = { id: 'user-123', email: 'test@example.com' };

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

			const result = await getCurrentUser();

			expect(result).toStrictEqual(mockUser);
		});

		it('should return null when session is invalid', async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			});

			const result = await getCurrentUser();

			expect(result).toBe(null);
		});

		it('should return null when auth error occurs', async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: new Error('Auth error'),
			});

			const result = await getCurrentUser();

			expect(result).toBe(null);
		});
	});

	describe('getUserAndAdminStatus', () => {
		it('should return user and admin status when user exists', async () => {
			const mockUser = { id: 'user-123', email: 'test@example.com' };
			const mockProfile = { user_id: 'user-123', isAdmin: true };

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

			// Mock the chained methods properly
			const mockSelect = jest.fn().mockReturnValue({
				eq: jest.fn().mockReturnValue({
					single: jest.fn().mockResolvedValue({
						data: mockProfile,
						error: null,
					}),
				}),
			});

			mockSupabaseClient.from.mockReturnValue({
				select: mockSelect,
			});

			const result = await getUserAndAdminStatus();

			expect(result).toStrictEqual({
				user: mockUser,
				isAdmin: true,
			});
		});

		it('should return null user and false admin when user does not exist', async () => {
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
	});

	describe('isUserAdmin', () => {
		it('should return true when user is admin', async () => {
			const mockUser = { id: 'user-123', email: 'test@example.com' };
			const mockProfile = { user_id: 'user-123', isAdmin: true };

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

			// Mock the chained methods properly
			const mockSelect = jest.fn().mockReturnValue({
				eq: jest.fn().mockReturnValue({
					single: jest.fn().mockResolvedValue({
						data: mockProfile,
						error: null,
					}),
				}),
			});

			mockSupabaseClient.from.mockReturnValue({
				select: mockSelect,
			});

			const result = await isUserAdmin('user-123');

			expect(result).toBe(true);
		});

		it('should return false when user is not admin', async () => {
			const mockUser = { id: 'user-123', email: 'test@example.com' };
			const mockProfile = { user_id: 'user-123', isAdmin: false };

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

			// Mock the chained methods properly
			const mockSelect = jest.fn().mockReturnValue({
				eq: jest.fn().mockReturnValue({
					single: jest.fn().mockResolvedValue({
						data: mockProfile,
						error: null,
					}),
				}),
			});

			mockSupabaseClient.from.mockReturnValue({
				select: mockSelect,
			});

			const result = await isUserAdmin('user-123');

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

		it('should return false when checking admin status for different user', async () => {
			const mockUser = { id: 'user-123', email: 'test@example.com' };

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

			const result = await isUserAdmin('different-user-id');

			expect(result).toBe(false);
		});
	});

	describe('requireAuth', () => {
		it('should return user when authenticated', async () => {
			const mockUser = { id: 'user-123', email: 'test@example.com' };

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

			const result = await requireAuth();

			expect(result).toStrictEqual(mockUser);
		});

		it('should throw error when not authenticated', async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			});

			await expect(requireAuth()).rejects.toThrow('Authentication required');
		});
	});

	describe('requireAdmin', () => {
		it('should return user when user is admin', async () => {
			const mockUser = { id: 'user-123', email: 'test@example.com' };
			const mockProfile = { user_id: 'user-123', isAdmin: true };

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

			// Mock the chained methods properly
			const mockSelect = jest.fn().mockReturnValue({
				eq: jest.fn().mockReturnValue({
					single: jest.fn().mockResolvedValue({
						data: mockProfile,
						error: null,
					}),
				}),
			});

			mockSupabaseClient.from.mockReturnValue({
				select: mockSelect,
			});

			const result = await requireAdmin();

			expect(result).toStrictEqual(mockUser);
		});

		it('should throw error when user is not admin', async () => {
			const mockUser = { id: 'user-123', email: 'test@example.com' };
			const mockProfile = { user_id: 'user-123', isAdmin: false };

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			});

			// Mock the chained methods properly
			const mockSelect = jest.fn().mockReturnValue({
				eq: jest.fn().mockReturnValue({
					single: jest.fn().mockResolvedValue({
						data: mockProfile,
						error: null,
					}),
				}),
			});

			mockSupabaseClient.from.mockReturnValue({
				select: mockSelect,
			});

			await expect(requireAdmin()).rejects.toThrow('Admin access required');
		});

		it('should throw error when not authenticated', async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			});

			await expect(requireAdmin()).rejects.toThrow('Authentication required');
		});
	});
});
