import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminControls } from '@/app/dashboard/songs/@components/AdminControls';
import { User } from '@/types/User';

// Mock the SearchBar component
jest.mock('@/app/dashboard/@components/SearchBar', () => {
  return function MockSearchBar({ profiles }: { profiles: User[] }) {
    return (
      <div data-testid="search-bar">
        <select data-testid="user-select">
          <option value="">Select a user</option>
          {profiles.map((profile) => (
            <option key={profile.user_id} value={profile.user_id}>
              {profile.email}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

const defaultProfiles: User[] = [
  {
    user_id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    user_id: '2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

describe('AdminControls', () => {
  it('should render with profiles', () => {
    render(<AdminControls profiles={defaultProfiles} />);

    expect(screen.getByText('Add New Song')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('user-select')).toBeInTheDocument();
  });

  it('should handle empty profiles array', () => {
    render(<AdminControls profiles={[]} />);

    expect(screen.getByText('Add New Song')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('user-select')).toBeInTheDocument();
  });

  it('should apply correct CSS classes for styling', () => {
    render(<AdminControls profiles={defaultProfiles} />);

    const container = screen.getByText('Add New Song').closest('div');
    expect(container).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'items-start', 'sm:items-center', 'gap-4', 'w-full', 'sm:w-auto');

    const addSongLink = screen.getByText('Add New Song');
    expect(addSongLink).toHaveClass('text-blue-500', 'hover:text-blue-600', 'font-bold', 'whitespace-nowrap');
  });

  it('should handle profiles with missing properties gracefully', () => {
    const incompleteProfiles: User[] = [
      {
        user_id: '1',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    render(<AdminControls profiles={incompleteProfiles} />);

    expect(screen.getByText('Add New Song')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('should have correct link href', () => {
    render(<AdminControls profiles={defaultProfiles} />);

    const addSongLink = screen.getByText('Add New Song');
    expect(addSongLink).toHaveAttribute('href', '/dashboard/songs/create');
  });

  it('should render search bar with correct props', () => {
    render(<AdminControls profiles={defaultProfiles} />);

    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toBeInTheDocument();
  });
}); 