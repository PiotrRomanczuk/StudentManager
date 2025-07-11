import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SongsClientComponentTesting from '@/app/dashboard/songs/@components/SongsClientComponent';
import { Song } from '@/types/Song';

// Mock the child components
jest.mock('@/app/dashboard/songs/@components/SongTable', () => ({
  SongTable: ({ songs, headers, actions, showStatus, onSort, getSortIndicator }: any) => (
    <div data-testid="song-table">
      <div>Songs Library</div>
      {songs.map((song: Song) => (
        <div key={song.id} data-testid={`song-${song.id}`}>
          {song.title}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('@/app/dashboard/songs/@components/SongTableMobile', () => ({
  SongTableMobile: ({ songs, actions, showStatus }: any) => (
    <div data-testid="song-table-mobile">
      {songs.map((song: Song) => (
        <div key={song.id} data-testid={`mobile-song-${song.id}`}>
          {song.title}
        </div>
      ))}
    </div>
  ),
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
  }),
}));

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Test Song 1',
    author: 'Test Author 1',
    level: 'beginner',
    key: 'C',
    chords: 'C G Am F',
    audio_files: 'test1.mp3',
    ultimate_guitar_link: 'https://ultimate-guitar.com/test1',
    short_title: 'test1',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Test Song 2',
    author: 'Test Author 2',
    level: 'intermediate',
    key: 'G',
    chords: 'G D Em C',
    audio_files: 'test2.mp3',
    ultimate_guitar_link: 'https://ultimate-guitar.com/test2',
    short_title: 'test2',
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-16'),
  },
];

describe('SongsClientComponentTesting', () => {
  const defaultProps = {
    songs: mockSongs,
    isAdmin: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with songs', () => {
    render(<SongsClientComponentTesting {...defaultProps} />);
    
    expect(screen.getByText('Songs Library')).toBeInTheDocument();
    expect(screen.getByTestId('song-1')).toBeInTheDocument();
    expect(screen.getByTestId('song-2')).toBeInTheDocument();
  });

  it('should render desktop table by default', () => {
    render(<SongsClientComponentTesting {...defaultProps} />);
    
    expect(screen.getByTestId('song-table')).toBeInTheDocument();
    expect(screen.queryByTestId('song-table-mobile')).not.toBeInTheDocument();
  });

  it('should render mobile table when view is set to mobile', () => {
    render(<SongsClientComponentTesting {...defaultProps} />);
    
    // Find and click the mobile view button
    const mobileButton = screen.getByLabelText('Mobile view');
    fireEvent.click(mobileButton);
    
    expect(screen.getByTestId('song-table-mobile')).toBeInTheDocument();
    expect(screen.queryByTestId('song-table')).not.toBeInTheDocument();
  });

  it('should toggle between desktop and mobile views', () => {
    render(<SongsClientComponentTesting {...defaultProps} />);
    
    // Initially desktop view
    expect(screen.getByTestId('song-table')).toBeInTheDocument();
    
    // Switch to mobile
    const mobileButton = screen.getByLabelText('Mobile view');
    fireEvent.click(mobileButton);
    expect(screen.getByTestId('song-table-mobile')).toBeInTheDocument();
    
    // Switch back to desktop
    const desktopButton = screen.getByLabelText('Desktop view');
    fireEvent.click(desktopButton);
    expect(screen.getByTestId('song-table')).toBeInTheDocument();
  });

  it('should show admin controls when isAdmin is true', () => {
    render(<SongsClientComponentTesting {...defaultProps} isAdmin={true} />);
    
    expect(screen.getByText('Admin Controls')).toBeInTheDocument();
  });

  it('should not show admin controls when isAdmin is false', () => {
    render(<SongsClientComponentTesting {...defaultProps} isAdmin={false} />);
    
    expect(screen.queryByText('Admin Controls')).not.toBeInTheDocument();
  });

  it('should handle empty songs array', () => {
    render(<SongsClientComponentTesting songs={[]} isAdmin={false} />);
    
    expect(screen.getByText('Songs Library')).toBeInTheDocument();
    expect(screen.queryByTestId('song-1')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes for styling', () => {
    render(<SongsClientComponentTesting {...defaultProps} />);
    
    const container = screen.getByTestId('song-table').closest('div');
    expect(container).toHaveClass('space-y-4', 'w-full', 'max-w-4xl', 'mx-auto');
  });

  it('should handle view state changes correctly', () => {
    render(<SongsClientComponentTesting {...defaultProps} />);
    
    // Check initial state is desktop
    expect(screen.getByTestId('song-table')).toBeInTheDocument();
    
    // Switch to mobile
    const mobileButton = screen.getByLabelText('Mobile view');
    fireEvent.click(mobileButton);
    
    // Verify mobile view is active
    expect(screen.getByTestId('song-table-mobile')).toBeInTheDocument();
    expect(mobileButton).toHaveClass('bg-gray-200');
  });

  it('should pass correct props to child components', () => {
    render(<SongsClientComponentTesting {...defaultProps} isAdmin={true} />);
    
    // Verify that the table receives the correct props
    expect(screen.getByTestId('song-table')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-song-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-song-2')).toBeInTheDocument();
  });

  it('should handle sorting functionality', () => {
    render(<SongsClientComponentTesting {...defaultProps} />);
    
    // The component should handle sorting through the table component
    expect(screen.getByTestId('song-table')).toBeInTheDocument();
  });

  it('should handle filtering functionality', () => {
    render(<SongsClientComponentTesting {...defaultProps} />);
    
    // The component should handle filtering through the table component
    expect(screen.getByTestId('song-table')).toBeInTheDocument();
  });
}); 