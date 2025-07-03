import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Dashboard from '@/app/dashboard/components/dashboard/Dashboard';
import AdminPage from '@/app/dashboard/components/main/adminPage';
import UserPage from '@/app/dashboard/components/main/userPage';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
}));

// Mock the songs data
const mockSongs = [
  {
    id: '1',
    title: 'Test Song 1',
    author: 'Test Author 1',
    level: 'Beginner',
    key: 'C',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Test Song 2',
    author: 'Test Author 2',
    level: 'Intermediate',
    key: 'G',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

describe('Dashboard Role-Based Rendering', () => {
  describe('Dashboard Component', () => {
    it('should show admin-only navigation items when isAdmin is true', () => {
      render(
        <Dashboard isAdmin={true}>
          <div>Dashboard Content</div>
        </Dashboard>
      );

      // Admin-only items should be visible
      expect(screen.getByText('Students')).toBeInTheDocument();
      expect(screen.getByText('Task Management')).toBeInTheDocument();
      expect(screen.getByText('Testing')).toBeInTheDocument();
    });

    it('should hide admin-only navigation items when isAdmin is false', () => {
      render(
        <Dashboard isAdmin={false}>
          <div>Dashboard Content</div>
        </Dashboard>
      );

      // Admin-only items should be hidden
      expect(screen.queryByText('Students')).not.toBeInTheDocument();
      expect(screen.queryByText('Task Management')).not.toBeInTheDocument();
      expect(screen.queryByText('Testing')).not.toBeInTheDocument();

      // Regular items should still be visible
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /songs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /lessons/i })).toBeInTheDocument();
    });

    it('should always show common navigation items regardless of admin status', () => {
      const { rerender } = render(
        <Dashboard isAdmin={true}>
          <div>Dashboard Content</div>
        </Dashboard>
      );

      // Common items should be visible for admin
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /songs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /lessons/i })).toBeInTheDocument();

      // Re-render as non-admin
      rerender(
        <Dashboard isAdmin={false}>
          <div>Dashboard Content</div>
        </Dashboard>
      );

      // Common items should still be visible for non-admin
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /songs/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /lessons/i })).toBeInTheDocument();
    });
  });

  describe('AdminPage Component', () => {
    it('should render admin-specific content', () => {
      render(<AdminPage />);

      // Admin-specific elements
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('+ Add New Student')).toBeInTheDocument();
      
      // Admin tabs
      expect(screen.getByText('Lessons')).toBeInTheDocument();
      expect(screen.getByText('Calendar')).toBeInTheDocument();
      expect(screen.getByText('Assignments')).toBeInTheDocument();
    });

    it('should show admin stats cards', () => {
      render(<AdminPage />);

      // Admin stats
      expect(screen.getByText('Total Students')).toBeInTheDocument();
      expect(screen.getByText('Lessons This Week')).toBeInTheDocument();
      expect(screen.getByText('Pending Assignments')).toBeInTheDocument();
      expect(screen.getByText('Progress Rate')).toBeInTheDocument();
    });
  });

  describe('UserPage Component', () => {
    it('should render student-specific content', () => {
      render(<UserPage songs={mockSongs} />);

      // Student-specific elements
      expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
      expect(screen.getByText('View Schedule')).toBeInTheDocument();
      
      // Student tabs - use more specific selectors
      expect(screen.getByRole('button', { name: /my lessons/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /assignments/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /progress/i })).toBeInTheDocument();
    });

    it('should show student stats cards', () => {
      render(<UserPage songs={mockSongs} />);

      // Student stats
      expect(screen.getByText('Upcoming Lessons')).toBeInTheDocument();
      expect(screen.getByText('Pending Assignments')).toBeInTheDocument();
      expect(screen.getByText('Practice Hours')).toBeInTheDocument();
    });

    it('should display recent songs', () => {
      render(<UserPage songs={mockSongs} />);

      // Use more specific selector for the section header
      expect(screen.getByRole('heading', { name: /recent songs/i })).toBeInTheDocument();
      expect(screen.getByText('Test Song 1')).toBeInTheDocument();
      expect(screen.getByText('Test Song 2')).toBeInTheDocument();
    });
  });

  describe('Role-Based Content Differences', () => {
    it('should show different content for admin vs student', () => {
      // Render admin page
      const { rerender } = render(<AdminPage />);
      expect(screen.getByText('+ Add New Student')).toBeInTheDocument();
      expect(screen.queryByText('Student Dashboard')).not.toBeInTheDocument();

      // Re-render as student page
      rerender(<UserPage songs={mockSongs} />);
      expect(screen.queryByText('+ Add New Student')).not.toBeInTheDocument();
      expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
    });

    it('should show different navigation items based on role', () => {
      // Admin navigation
      const { rerender } = render(
        <Dashboard isAdmin={true}>
          <div>Content</div>
        </Dashboard>
      );
      expect(screen.getByText('Students')).toBeInTheDocument();

      // Student navigation
      rerender(
        <Dashboard isAdmin={false}>
          <div>Content</div>
        </Dashboard>
      );
      expect(screen.queryByText('Students')).not.toBeInTheDocument();
    });
  });
}); 