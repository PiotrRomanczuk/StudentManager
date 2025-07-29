import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserManagement } from '@/app/dashboard/@components/admin/UserManagement';

// Mock the API calls
jest.mock('@/utils/api-helpers', () => ({
  fetchWithAuth: jest.fn(),
}));

// Mock the toast notifications
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('UserManagement Component', () => {
  const mockUsers = [
    {
      id: 1,
      user_id: 'user-1',
      email: 'student1@test.com',
      firstName: 'John',
      lastName: 'Doe',
      isStudent: true,
      isActive: true,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      user_id: 'user-2',
      email: 'student2@test.com',
      firstName: 'Jane',
      lastName: 'Smith',
      isStudent: true,
      isActive: false,
      created_at: '2024-01-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render user management page with users list', async () => {
    render(<UserManagement />);

    // Check if the page title is rendered
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Manage student profiles')).toBeInTheDocument();

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should open edit modal when edit button is clicked', async () => {
    render(<UserManagement />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click edit button for first user
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Check if modal is opened
    expect(screen.getByText('Edit User Profile')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('student1@test.com')).toBeInTheDocument();
  });

  it('should update user profile when form is submitted', async () => {
    const mockFetchWithAuth = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    jest.mocked(require('@/utils/api-helpers').fetchWithAuth).mockImplementation(mockFetchWithAuth);

    render(<UserManagement />);

    // Wait for users to load and open edit modal
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Update form fields
    const firstNameInput = screen.getByDisplayValue('John');
    const lastNameInput = screen.getByDisplayValue('Doe');
    
    fireEvent.change(firstNameInput, { target: { value: 'John Updated' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe Updated' } });

    // Submit form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    // Check if API was called
    await waitFor(() => {
      expect(mockFetchWithAuth).toHaveBeenCalledWith('/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify({
          user_id: 'user-1',
          firstName: 'John Updated',
          lastName: 'Doe Updated',
        }),
      });
    });
  });

  it('should show error message when API call fails', async () => {
    const mockFetchWithAuth = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Update failed' }),
    });

    jest.mocked(require('@/utils/api-helpers').fetchWithAuth).mockImplementation(mockFetchWithAuth);

    render(<UserManagement />);

    // Wait for users to load and open edit modal
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Submit form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    // Check if error toast was called
    await waitFor(() => {
      expect(require('react-hot-toast').toast.error).toHaveBeenCalledWith('Update failed');
    });
  });

  it('should filter users by search term', async () => {
    render(<UserManagement />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Type in search box
    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // Check if only John is visible
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('should toggle user active status', async () => {
    const mockFetchWithAuth = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    jest.mocked(require('@/utils/api-helpers').fetchWithAuth).mockImplementation(mockFetchWithAuth);

    render(<UserManagement />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Find and click the active toggle for the first user
    const activeToggles = screen.getAllByRole('button', { name: /active/i });
    fireEvent.click(activeToggles[0]);

    // Check if API was called
    await waitFor(() => {
      expect(mockFetchWithAuth).toHaveBeenCalledWith('/api/admin/user-management', {
        method: 'PATCH',
        body: JSON.stringify({
          user_id: 'user-1',
          isActive: false,
        }),
      });
    });
  });
}); 