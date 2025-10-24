import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/auth/signin/page';
import SignUpPage from '@/app/auth/signup/page';
import userEvent from '@testing-library/user-event';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
	redirect: jest.fn(),
	revalidatePath: jest.fn(),
}));

describe('Auth Components', () => {
	describe('LoginPage', () => {
		it('should render login form with all required elements', () => {
			render(<LoginPage />);

			expect(screen.getByText('Welcome back')).toBeInTheDocument();
			expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: /^sign in$/i })
			).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: /sign in with google/i })
			).toBeInTheDocument();
		});

		it('should allow typing in email and password fields', async () => {
			render(<LoginPage />);

			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/^password$/i);

			await userEvent.type(emailInput, 'test@example.com');
			await userEvent.type(passwordInput, 'password123');

			expect(emailInput).toHaveValue('test@example.com');
			expect(passwordInput).toHaveValue('password123');
		});

		it('should toggle password visibility', async () => {
			render(<LoginPage />);

			const passwordInput = screen.getByLabelText(/^password$/i);
			const toggleButton = screen.getByRole('button', {
				name: /show password/i,
			});

			expect(passwordInput).toHaveAttribute('type', 'password');

			await userEvent.click(toggleButton);
			expect(passwordInput).toHaveAttribute('type', 'text');

			await userEvent.click(toggleButton);
			expect(passwordInput).toHaveAttribute('type', 'password');
		});

		it('should have remember me checkbox', () => {
			render(<LoginPage />);

			const rememberMeCheckbox = screen.getByRole('checkbox', {
				name: /remember me/i,
			});
			expect(rememberMeCheckbox).toBeInTheDocument();
		});

		it('should have forgot password link', () => {
			render(<LoginPage />);

			const forgotPasswordLink = screen.getByRole('link', {
				name: /forgot password/i,
			});
			expect(forgotPasswordLink).toBeInTheDocument();
			expect(forgotPasswordLink).toHaveAttribute(
				'href',
				'/auth/forgot-password'
			);
		});

		it('should have sign up link', () => {
			render(<LoginPage />);

			const signUpLink = screen.getByRole('link', { name: /sign up/i });
			expect(signUpLink).toBeInTheDocument();
			expect(signUpLink).toHaveAttribute('href', '/auth/signup');
		});
	});

	describe('SignUpPage', () => {
		it('should render signup form with all required elements', () => {
			render(<SignUpPage />);

			expect(screen.getByText('Create an account')).toBeInTheDocument();
			expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: /sign up/i })
			).toBeInTheDocument();
		});

		it('should allow typing in all form fields', async () => {
			render(<SignUpPage />);

			const firstNameInput = screen.getByLabelText(/first name/i);
			const lastNameInput = screen.getByLabelText(/last name/i);
			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/^password$/i);
			const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

			await userEvent.type(firstNameInput, 'John');
			await userEvent.type(lastNameInput, 'Doe');
			await userEvent.type(emailInput, 'john@example.com');
			await userEvent.type(passwordInput, 'password123');
			await userEvent.type(confirmPasswordInput, 'password123');

			expect(firstNameInput).toHaveValue('John');
			expect(lastNameInput).toHaveValue('Doe');
			expect(emailInput).toHaveValue('john@example.com');
			expect(passwordInput).toHaveValue('password123');
			expect(confirmPasswordInput).toHaveValue('password123');
		});

		it('should have password requirements text', () => {
			render(<SignUpPage />);

			expect(
				screen.getByText(/password must be at least 8 characters long/i)
			).toBeInTheDocument();
		});

		it('should have sign in link', () => {
			render(<SignUpPage />);

			const signInLink = screen.getByRole('link', { name: /log in/i });
			expect(signInLink).toBeInTheDocument();
			expect(signInLink).toHaveAttribute('href', '/auth/signin');
		});

		it('should have required attributes on form fields', () => {
			render(<SignUpPage />);

			const firstNameInput = screen.getByLabelText(/first name/i);
			const lastNameInput = screen.getByLabelText(/last name/i);
			const emailInput = screen.getByLabelText(/email/i);
			const passwordInput = screen.getByLabelText(/^password$/i);
			const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

			expect(firstNameInput).toHaveAttribute('required');
			expect(lastNameInput).toHaveAttribute('required');
			expect(emailInput).toHaveAttribute('required');
			expect(passwordInput).toHaveAttribute('required');
			expect(confirmPasswordInput).toHaveAttribute('required');
		});
	});
});
