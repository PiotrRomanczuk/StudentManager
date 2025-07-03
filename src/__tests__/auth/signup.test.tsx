import '@testing-library/jest-dom';
// Ensure jest-dom matchers are available for type checking
import { render, screen, waitFor } from '@testing-library/react';
import SignUpPage from '@/app/auth/signup/page';
import userEvent from '@testing-library/user-event';

// Mock the signup action
jest.mock('@/app/auth/signup/actions', () => ({
  signup: jest.fn(),
}));

import { signup } from '@/app/auth/signup/actions';

describe('SignUpPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all required fields', () => {
    render(<SignUpPage />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () => {
    render(<SignUpPage />);
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'different');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('calls signup action with correct data', async () => {
    signup.mockResolvedValue({ success: true });
    render(<SignUpPage />);
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Smith');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(signup).toHaveBeenCalled();
      const formData = signup.mock.calls[0][0];
      expect(formData.get('firstName')).toBe('Jane');
      expect(formData.get('lastName')).toBe('Smith');
      expect(formData.get('email')).toBe('jane@example.com');
      expect(formData.get('password')).toBe('password123');
    });
  });

  it('shows error if API returns error', async () => {
    signup.mockResolvedValue({ success: false });
    render(<SignUpPage />);
    await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Smith');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/error signing up/i)).toBeInTheDocument();
    });
  });
}); 