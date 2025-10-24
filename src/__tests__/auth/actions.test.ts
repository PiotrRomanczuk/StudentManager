import { login, signInWithGoogle, logout } from '@/app/auth/signin/actions';
import { signup } from '@/app/auth/signup/actions';
import { createClient } from '@/utils/supabase/clients/server';
import { redirect } from 'next/navigation';

// Mock Supabase client
jest.mock('@/utils/supabase/clients/server');
jest.mock('next/navigation');
jest.mock('next/cache', () => ({
	revalidatePath: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<
	typeof createClient
>;

(redirect as unknown as jest.Mock).mockImplementation(() => {
	throw new Error('NEXT_REDIRECT');
});

describe('Auth Actions', () => {
	let mockSupabase: unknown;

	beforeEach(() => {
		mockSupabase = {
			auth: {
				signInWithPassword: jest.fn(),
				signInWithOAuth: jest.fn(),
				signOut: jest.fn(),
				getUser: jest.fn(),
				signUp: jest.fn(),
			},
			from: jest.fn().mockReturnThis(),
			insert: jest.fn().mockReturnThis(),
		};

		mockCreateClient.mockResolvedValue(mockSupabase);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('login', () => {
		it('should successfully log in with valid credentials', async () => {
			const formData = new FormData();
			formData.append('email', 'test@test.com');
			formData.append('password', 'test123');
			formData.append('rememberMe', 'on');

			mockSupabase.auth.signInWithPassword.mockResolvedValue({
				data: { user: { id: 'user-123' } },
				error: null,
			});

			await expect(login(formData)).rejects.toThrow('NEXT_REDIRECT');
		});

		it('should throw error on invalid credentials', async () => {
			const formData = new FormData();
			formData.append('email', 'test@example.com');
			formData.append('password', 'wrongpassword');

			mockSupabase.auth.signInWithPassword.mockResolvedValue({
				data: { user: null },
				error: { message: 'Invalid credentials' },
			});

			await expect(login(formData)).rejects.toThrow('Invalid credentials');
		});

		it('should handle missing email', async () => {
			const formData = new FormData();
			formData.append('password', 'password123');

			await expect(login(formData)).rejects.toThrow();
		});
	});

	describe('signup', () => {
		it('should successfully create a new user', async () => {
			const formData = new FormData();
			formData.append('email', 'newuser@example.com');
			formData.append('password', 'password123');
			formData.append('firstName', 'John');
			formData.append('lastName', 'Doe');

			mockSupabase.auth.signUp.mockResolvedValue({
				data: { user: { id: 'user-123' } },
				error: null,
			});

			mockSupabase.from.mockReturnValue({
				insert: jest.fn().mockResolvedValue({ error: null }),
			});

			const result = await signup(formData);
			expect(result).toEqual({ success: true });
		});

		it('should handle signup errors', async () => {
			const formData = new FormData();
			formData.append('email', 'existing@example.com');
			formData.append('password', 'password123');
			formData.append('firstName', 'John');
			formData.append('lastName', 'Doe');

			mockSupabase.auth.signUp.mockResolvedValue({
				data: { user: null },
				error: { message: 'User already exists' },
			});

			await expect(signup(formData)).rejects.toThrow('User already exists');
		});

		it('should handle profile creation errors', async () => {
			const formData = new FormData();
			formData.append('email', 'newuser@example.com');
			formData.append('password', 'password123');
			formData.append('firstName', 'John');
			formData.append('lastName', 'Doe');

			mockSupabase.auth.signUp.mockResolvedValue({
				data: { user: { id: 'user-123' } },
				error: null,
			});

			mockSupabase.from.mockReturnValue({
				insert: jest.fn().mockResolvedValue({
					error: { message: 'Database error' },
				}),
			});

			await expect(signup(formData)).rejects.toThrow('Database error');
		});
	});

	describe('signInWithGoogle', () => {
		it('should initiate Google OAuth flow', async () => {
			mockSupabase.auth.signInWithOAuth.mockResolvedValue({
				data: { url: 'https://google.com/oauth' },
				error: null,
			});

			await expect(signInWithGoogle()).rejects.toThrow('NEXT_REDIRECT');
		});

		it('should handle OAuth errors', async () => {
			mockSupabase.auth.signInWithOAuth.mockResolvedValue({
				data: { url: null },
				error: { message: 'OAuth error' },
			});

			await expect(signInWithGoogle()).rejects.toThrow('OAuth error');
		});
	});

	describe('logout', () => {
		it('should successfully log out user', async () => {
			mockSupabase.auth.signOut.mockResolvedValue({ error: null });

			await expect(logout()).rejects.toThrow('NEXT_REDIRECT');
		});
	});
});
