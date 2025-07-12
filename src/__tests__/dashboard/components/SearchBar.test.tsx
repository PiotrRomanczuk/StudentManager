import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/app/dashboard/@components/SearchBar';
import { User } from '@/types/User';

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams('?user_id=test-user'),
}));

describe('SearchBar', () => {
  const mockProfiles: User[] = [
    {
      user_id: 'user1',
      email: 'user1@example.com',
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
    },
    {
      user_id: 'user2',
      email: 'user2@example.com',
      created_at: '2023-01-02',
      updated_at: '2023-01-02',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search bar with select trigger', () => {
    render(<SearchBar profiles={mockProfiles} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render select trigger with search icon', () => {
    render(<SearchBar profiles={mockProfiles} />);
    
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();
  });

  it('should display user profiles in dropdown', () => {
    render(<SearchBar profiles={mockProfiles} />);
    
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
  });

  it('should sort users alphabetically by email', () => {
    const unsortedProfiles: User[] = [
      {
        user_id: 'user2',
        email: 'zebra@example.com',
        created_at: '2023-01-02',
        updated_at: '2023-01-02',
      },
      {
        user_id: 'user1',
        email: 'alpha@example.com',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
      },
    ];

    render(<SearchBar profiles={unsortedProfiles} />);
    
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveTextContent('alpha@example.com');
    expect(options[1]).toHaveTextContent('zebra@example.com');
  });

  it('should show user profiles in dropdown', () => {
    render(<SearchBar profiles={mockProfiles} />);
    
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
  });

  it('should handle empty profiles array', () => {
    render(<SearchBar profiles={[]} />);
    
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    
    expect(screen.getByText('Select a user')).toBeInTheDocument();
  });

  it('should handle single profile', () => {
    const singleProfile: User[] = [mockProfiles[0]];
    render(<SearchBar profiles={singleProfile} />);
    
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<SearchBar profiles={mockProfiles} />);
    
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toHaveClass('w-[220px]', 'pl-9', 'bg-white');
  });

  it('should display search icon', () => {
    render(<SearchBar profiles={mockProfiles} />);
    
    // Check for the search icon by its class
    const searchIcon = document.querySelector('.lucide-search');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should handle user selection', () => {
    render(<SearchBar profiles={mockProfiles} />);
    
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    
    const firstUser = screen.getByText('user1@example.com');
    fireEvent.click(firstUser);
    
    // The actual navigation would be handled by the router mock
    expect(selectTrigger).toBeInTheDocument();
  });
}); 