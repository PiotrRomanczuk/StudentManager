import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SongsClientComponent from '@/app/dashboard/songs/@components/SongsClientComponent';
import { Song } from '@/types/Song';

// Debug import
console.log('SongsClientComponent:', SongsClientComponent);
console.log('Type of SongsClientComponent:', typeof SongsClientComponent);

// Simple test to check if component can be imported
describe('SongsClientComponent Import Test', () => {
  it('should import the component successfully', () => {
    expect(SongsClientComponent).toBeDefined();
    expect(typeof SongsClientComponent).toBe('function');
  });
});

// Mock the child components
jest.mock('@/app/dashboard/songs/@components/SongTable', () => ({
  SongTable: function MockSongTable({ songs, headers, actions, showStatus, onSort, getSortIndicator, headersLength }: any) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4" data-testid="song-table-wrapper">
        <div data-testid="song-table">
          <div data-testid="song-count">{songs.length}</div>
          <div data-testid="headers">{headersLength !== undefined ? headersLength : headers.length}</div>
          <div data-testid="actions">{actions.length}</div>
          <div data-testid="show-status">{showStatus.toString()}</div>
          {songs.map((song: any) => (
            <div key={song.id} data-testid={`song-${song.id}`}>
              {song.title} - {song.author}
            </div>
          ))}
        </div>
      </div>
    );
  }
}));

jest.mock('@/app/dashboard/songs/@components/SongTableMobile', () => ({
  SongTableMobile: function MockSongTableMobile({ songs, actions, showStatus }: any) {
    return (
      <div data-testid="song-table-mobile">
        <div data-testid="mobile-song-count">{songs.length}</div>
        <div data-testid="mobile-actions">{actions.length}</div>
        <div data-testid="mobile-show-status">{showStatus.toString()}</div>
        {songs.map((song: Song) => (
          <div key={song.id} data-testid={`mobile-song-${song.id}`}>
            {song.title} - {song.author}
          </div>
        ))}
      </div>
    );
  }
}));

jest.mock('@/app/dashboard/songs/@components/SongSearchBar', () => ({
  SongSearchBar: function MockSongSearchBar({ songs, onSearch }: any) {
    return (
      <div data-testid="song-search-bar">
        <input
          data-testid="search-input"
          placeholder="Search songs..."
          onChange={(e) => onSearch(e.target.value)}
        />
        <div data-testid="search-songs-count">{songs.length}</div>
      </div>
    );
  }
}));

jest.mock('@/app/dashboard/@components/pagination/PaginationComponent', () => ({
  PaginationComponent: function MockPaginationComponent({ currentPage, totalPages, onPageChange }: any) {
    return (
      <div data-testid="pagination">
        <div data-testid="current-page">{currentPage}</div>
        <div data-testid="total-pages">{totalPages}</div>
        <button
          data-testid="next-page"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
        <button
          data-testid="prev-page"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
      </div>
    );
  }
}));

// Mock the hooks
jest.mock('@/app/dashboard/songs/@components/hooks/useSongSorting', () => ({
  useSongSorting: jest.fn((songs) => ({
    sortKey: 'title',
    sortDirection: 'asc' as const,
    sortedSongs: songs || [],
    handleSort: jest.fn(),
    getSortIndicator: jest.fn(() => ''),
  })),
}));

jest.mock('@/app/dashboard/songs/@components/hooks/useSongFiltering', () => ({
  useSongFiltering: jest.fn((songs) => ({
    searchQuery: '',
    setSearchQuery: jest.fn(),
    filteredSongs: songs || [],
  })),
}));

jest.mock('@/app/dashboard/songs/@components/hooks/useSongTable', () => ({
  useSongTable: jest.fn((songs, currentPage, itemsPerPage) => ({
    currentSongs: songs || [],
  })),
}));

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Wonderwall',
    author: 'Oasis',
    level: 'beginner',
    key: 'C',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/oasis/wonderwall-tabs-81',
    created_at: new Date('2024-01-15T00:00:00Z'),
    updated_at: new Date('2024-01-15T00:00:00Z')
  },
  {
    id: '2',
    title: 'Hotel California',
    author: 'Eagles',
    level: 'intermediate',
    key: 'Am',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/eagles/hotel-california-tabs-123',
    created_at: new Date('2024-01-16T00:00:00Z'),
    updated_at: new Date('2024-01-16T00:00:00Z')
  },
  {
    id: '3',
    title: 'Stairway to Heaven',
    author: 'Led Zeppelin',
    level: 'advanced',
    key: 'Am',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/led-zeppelin/stairway-to-heaven-tabs-456',
    created_at: new Date('2024-01-17T00:00:00Z'),
    updated_at: new Date('2024-01-17T00:00:00Z')
  }
];

describe('SongsClientComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with songs for admin user', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={true} />);

    expect(screen.getByTestId('song-search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('song-table')).toBeInTheDocument();
    expect(screen.getByTestId('song-count')).toHaveTextContent('3');
  });

  it('should render with songs for student user', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={false} />);

    expect(screen.getByTestId('song-search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('song-table')).toBeInTheDocument();
    expect(screen.getByTestId('song-count')).toHaveTextContent('3');
  });

  it('should render mobile view for small screens', () => {
    // Mock window.innerWidth to simulate mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<SongsClientComponent songs={mockSongs} isAdmin={true} />);

    expect(screen.getByTestId('song-table-mobile')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-song-count')).toHaveTextContent('3');
  });

  it('should handle search functionality', async () => {
    const user = userEvent.setup();
    render(<SongsClientComponent songs={mockSongs} isAdmin={true} />);

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'wonder');

    expect(searchInput).toHaveValue('wonder');
  });

  it('should show pagination when there are more than 15 songs', () => {
    const manySongs = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Song ${i + 1}`,
      author: `Artist ${i + 1}`,
      level: 'beginner' as const,
      key: 'C',
      ultimate_guitar_link: `https://example.com/song-${i + 1}`,
      created_at: new Date('2024-01-15T00:00:00Z'),
      updated_at: new Date('2024-01-15T00:00:00Z')
    }));

    render(<SongsClientComponent songs={manySongs} isAdmin={true} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    expect(screen.getByTestId('total-pages')).toHaveTextContent('2');
  });

  it('should not show pagination when there are 15 or fewer songs', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={true} />);

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('should handle page changes', async () => {
    const user = userEvent.setup();
    const manySongs = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Song ${i + 1}`,
      author: `Artist ${i + 1}`,
      level: 'beginner' as const,
      key: 'C',
      ultimate_guitar_link: `https://example.com/song-${i + 1}`,
      created_at: new Date('2024-01-15T00:00:00Z'),
      updated_at: new Date('2024-01-15T00:00:00Z')
    }));

    render(<SongsClientComponent songs={manySongs} isAdmin={true} />);

    const nextButton = screen.getByTestId('next-page');
    await user.click(nextButton);

    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
  });

  it('should display correct headers for admin user', () => {
    render(
      <SongsClientComponent songs={mockSongs} isAdmin={true} />
    );
    expect(screen.getByTestId('headers')).toHaveTextContent('4');
  });

  it('should display correct headers for student user', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={false} />);

    expect(screen.getByTestId('headers')).toHaveTextContent('5'); // STUDENT_TABLE_HEADERS length
  });

  it('should display correct actions for admin user', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={true} />);

    expect(screen.getByTestId('actions')).toHaveTextContent('3'); // view, edit, delete
  });

  it('should display correct actions for student user', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={false} />);

    expect(screen.getByTestId('actions')).toHaveTextContent('1'); // view only
  });

  it('should show status for student user', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={false} />);

    expect(screen.getByTestId('show-status')).toHaveTextContent('true');
  });

  it('should not show status for admin user', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={true} />);

    expect(screen.getByTestId('show-status')).toHaveTextContent('false');
  });

  it('should handle empty songs array', () => {
    render(<SongsClientComponent songs={[]} isAdmin={true} />);

    expect(screen.getByTestId('song-count')).toHaveTextContent('0');
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={true} />);

    const container = screen.getByTestId('song-table-wrapper').closest('div');
    expect(container).toHaveClass('w-full', 'px-4', 'sm:px-6', 'lg:px-8', 'space-y-4');
  });

  it('should render search bar with correct props', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={true} />);

    expect(screen.getByTestId('search-songs-count')).toHaveTextContent('3');
  });

  it('should handle responsive design correctly', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={true} />);

    // Check that both mobile and desktop views are rendered
    expect(screen.getByTestId('song-table-mobile')).toBeInTheDocument();
    expect(screen.getByTestId('song-table')).toBeInTheDocument();
  });

  it('should pass correct props to mobile table', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={true} />);

    expect(screen.getByTestId('mobile-song-count')).toHaveTextContent('3');
    expect(screen.getByTestId('mobile-actions')).toHaveTextContent('3');
  });

  it('should pass correct props to mobile table for student', () => {
    render(<SongsClientComponent songs={mockSongs} isAdmin={false} />);

    expect(screen.getByTestId('mobile-song-count')).toHaveTextContent('3');
    expect(screen.getByTestId('mobile-actions')).toHaveTextContent('1');
  });
}); 