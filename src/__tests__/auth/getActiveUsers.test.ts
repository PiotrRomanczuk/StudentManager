import { getActiveUsers } from '@/utils/auth-helpers';

// Mock the Supabase client
jest.mock('@/utils/supabase/clients/server', () => ({
	createClient: jest.fn(),
}));

describe('getActiveUsers', () => {
	let mockSupabase: any;

	beforeEach(() => {
		// Reset mocks
		jest.clearAllMocks();

		// Create mock Supabase client
		mockSupabase = {
			auth: {
				getUser: jest.fn(),
			},
			from: jest.fn(() => mockSupabase),
			select: jest.fn(() => mockSupabase),
			eq: jest.fn(() => mockSupabase),
			single: jest.fn(() => mockSupabase),
		};

		const { createClient } = require('@/utils/supabase/clients/server');
		createClient.mockResolvedValue(mockSupabase);
	});

	it('should return active users when user is admin', async () => {
		// Mock authenticated admin user
		mockSupabase.auth.getUser.mockResolvedValue({
			data: { user: { id: 'admin-user-id' } },
			error: null,
		});

		// Mock admin check
		mockSupabase.from.mockReturnValue(mockSupabase);
		mockSupabase.select.mockReturnValue(mockSupabase);
		mockSupabase.eq.mockReturnValue(mockSupabase);
		mockSupabase.single.mockResolvedValue({
			data: { isAdmin: true },
			error: null,
		});

		// Mock active users response
		const mockActiveUsers = [
			{ id: 1, user_id: 'user1', email: 'user1@example.com', isActive: true },
			{ id: 2, user_id: 'user2', email: 'user2@example.com', isActive: true },
		];

		mockSupabase.single.mockResolvedValueOnce({
			data: { isAdmin: true },
			error: null,
		});

		mockSupabase.eq.mockImplementation((column: string, value: any) => {
			if (column === 'user_id') {
				return mockSupabase;
			}
			if (column === 'isActive' && value === true) {
				return {
					data: mockActiveUsers,
					error: null,
				};
			}
			return mockSupabase;
		});

		const result = await getActiveUsers();

		expect(result).toEqual(mockActiveUsers);
		expect(mockSupabase.auth.getUser).toHaveBeenCalled();
		expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
	});

	it('should throw error when user is not authenticated', async () => {
		// Mock unauthenticated user
		mockSupabase.auth.getUser.mockResolvedValue({
			data: { user: null },
			error: null,
		});

		await expect(getActiveUsers()).rejects.toThrow('Authentication required');
	});

	it('should throw error when user is not admin', async () => {
		// Mock authenticated non-admin user
		mockSupabase.auth.getUser.mockResolvedValue({
			data: { user: { id: 'non-admin-user-id' } },
			error: null,
		});

		// Mock non-admin check
		mockSupabase.from.mockReturnValue(mockSupabase);
		mockSupabase.select.mockReturnValue(mockSupabase);
		mockSupabase.eq.mockReturnValue(mockSupabase);
		mockSupabase.single.mockResolvedValue({
			data: { isAdmin: false },
			error: null,
		});

		await expect(getActiveUsers()).rejects.toThrow('Admin access required');
	});

	it('should throw error when database query fails', async () => {
		// Mock authenticated admin user
		mockSupabase.auth.getUser.mockResolvedValue({
			data: { user: { id: 'admin-user-id' } },
			error: null,
		});

		// Mock admin check
		mockSupabase.from.mockReturnValue(mockSupabase);
		mockSupabase.select.mockReturnValue(mockSupabase);
		mockSupabase.eq.mockReturnValue(mockSupabase);
		mockSupabase.single.mockResolvedValue({
			data: { isAdmin: true },
			error: null,
		});

		// Mock database error
		mockSupabase.eq.mockImplementation((column: string, value: any) => {
			if (column === 'user_id') {
				return mockSupabase;
			}
			if (column === 'isActive' && value === true) {
				return {
					data: null,
					error: { message: 'Database error' },
				};
			}
			return mockSupabase;
		});

		await expect(getActiveUsers()).rejects.toThrow(
			'Error fetching active users'
		);
	});
});
