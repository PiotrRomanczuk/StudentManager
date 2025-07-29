import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { StudentsCard } from '@/app/dashboard/students/components/StudentsCard';

// Mock the API helpers
jest.mock('@/utils/api-helpers', () => ({
  fetchApi: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Students User Management', () => {
  const mockProfiles = [
    {
      id: '1',
      user_id: 'user1',
      email: 'student1@example.com',
      username: 'student1',
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Test bio',
      isAdmin: false,
      isTeacher: false,
      isStudent: true,
      canEdit: true,
      isActive: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      user_id: 'user2',
      email: 'teacher1@example.com',
      username: 'teacher1',
      firstName: 'Jane',
      lastName: 'Smith',
      bio: 'Teacher bio',
      isAdmin: false,
      isTeacher: true,
      isStudent: false,
      canEdit: true,
      isActive: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Admin User Management', () => {
    it('should render user management interface for admin users', () => {
      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={true}
        />
      );
      
      expect(screen.getByText('Student Management')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search students...')).toBeInTheDocument();
    });

    it('should show edit and toggle buttons for admin users', () => {
      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={true}
        />
      );
      
      // Check for edit buttons
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons.length).toBeGreaterThan(0);
      
      // Check for toggle active buttons
      const toggleButtons = screen.getAllByText(/Activate|Deactivate/);
      expect(toggleButtons.length).toBeGreaterThan(0);
    });

    it('should open edit modal when edit button is clicked', () => {
      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={true}
        />
      );
      
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      expect(screen.getByText('Edit Student Profile')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('student1@example.com')).toBeInTheDocument();
    });

    it('should allow editing user properties in modal', () => {
      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={true}
        />
      );
      
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      expect(screen.getByText('Edit Student Profile')).toBeInTheDocument();
      
      // Test editing first name
      const firstNameInput = screen.getByDisplayValue('John');
      fireEvent.change(firstNameInput, { target: { value: 'Updated Name' } });
      expect(firstNameInput).toHaveValue('Updated Name');
      
      // Test editing email
      const emailInput = screen.getByDisplayValue('student1@example.com');
      fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });
      expect(emailInput).toHaveValue('updated@example.com');
    });

    it('should show role and status badges for each user', () => {
      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={true}
        />
      );
      
      // Check for role badges
      expect(screen.getByText('Student')).toBeInTheDocument();
      expect(screen.getByText('Teacher')).toBeInTheDocument();
      
      // Check for status badges
      expect(screen.getAllByText('Active')).toHaveLength(2);
    });

    it('should save user changes when save button is clicked', async () => {
      const mockFetchApi = jest.fn().mockResolvedValue({
        id: '1',
        user_id: 'user1',
        firstName: 'Updated Name',
        lastName: 'Doe',
        email: 'updated@example.com',
      });

      jest.mocked(require('@/utils/api-helpers').fetchApi).mockImplementation(mockFetchApi);

      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={true}
        />
      );
      
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      // Update form fields
      const firstNameInput = screen.getByDisplayValue('John');
      fireEvent.change(firstNameInput, { target: { value: 'Updated Name' } });
      
      // Click save button
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
      
      // Check if API was called
      await waitFor(() => {
        expect(mockFetchApi).toHaveBeenCalledWith('/api/admin/user-management', {
          method: 'PATCH',
          body: JSON.stringify({
            user_id: 'user1',
            firstName: 'Updated Name',
            lastName: 'Doe',
            email: 'student1@example.com',
            bio: 'Test bio',
            isStudent: true,
            isTeacher: false,
            isAdmin: false,
            canEdit: true,
            isActive: true,
          }),
        });
      });
    });
  });

  describe('Non-Admin User View', () => {
    it('should render read-only interface for non-admin users', () => {
      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={false}
        />
      );
      
      expect(screen.getByText('Student Management')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search students...')).toBeInTheDocument();
    });

    it('should not show edit and toggle buttons for non-admin users', () => {
      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={false}
        />
      );
      
      // Should not show edit buttons
      const editButtons = screen.queryAllByText('Edit');
      expect(editButtons).toHaveLength(0);
      
      // Should not show toggle buttons
      const toggleButtons = screen.queryAllByText(/Activate|Deactivate/);
      expect(toggleButtons).toHaveLength(0);
    });

    it('should still show user information and badges', () => {
      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={false}
        />
      );
      
      // Check for role badges
      expect(screen.getByText('Student')).toBeInTheDocument();
      expect(screen.getByText('Teacher')).toBeInTheDocument();
      
      // Check for status badges
      expect(screen.getAllByText('Active')).toHaveLength(2);
    });
  });

  describe('Search Functionality', () => {
    it('should filter users by search term', () => {
      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={true}
        />
      );
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      
      const searchInput = screen.getByPlaceholderText('Search students...');
      fireEvent.change(searchInput, { target: { value: 'John' } });
      
      // Should still show John but not Jane
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    it('should search by email', () => {
      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={true}
        />
      );
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      
      const searchInput = screen.getByPlaceholderText('Search students...');
      fireEvent.change(searchInput, { target: { value: 'student1@example.com' } });
      
      // Should show John but not Jane
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  describe('Toggle Active Status', () => {
    it('should toggle user active status when button is clicked', async () => {
      const mockFetchApi = jest.fn().mockResolvedValue({
        id: '1',
        user_id: 'user1',
        isActive: false,
      });

      jest.mocked(require('@/utils/api-helpers').fetchApi).mockImplementation(mockFetchApi);

      render(
        <StudentsCard 
          data={mockProfiles} 
          sortField="email" 
          sortDir="asc"
          isAdmin={true}
        />
      );
      
      const toggleButtons = screen.getAllByText(/Activate|Deactivate/);
      fireEvent.click(toggleButtons[0]);
      
      await waitFor(() => {
        expect(mockFetchApi).toHaveBeenCalledWith('/api/admin/user-management', {
          method: 'PATCH',
          body: JSON.stringify({
            user_id: 'user1',
            isActive: false,
          }),
        });
      });
    });
  });
}); 