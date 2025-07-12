import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongSearchBar } from '@/app/dashboard/songs/@components/SongSearchBar';
import { Song } from '@/types/Song';

// Mock the Song type
const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Wonderwall',
    author: 'Oasis',
    level: 'beginner',
    key: 'C',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/oasis/wonderwall-tabs-81',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Hotel California',
    author: 'Eagles',
    level: 'intermediate',
    key: 'Am',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/eagles/hotel-california-tabs-123',
    created_at: '2024-01-16T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z'
  },
  {
    id: '3',
    title: 'Stairway to Heaven',
    author: 'Led Zeppelin',
    level: 'advanced',
    key: 'Am',
    ultimate_guitar_link: 'https://tabs.ultimate-guitar.com/tab/led-zeppelin/stairway-to-heaven-tabs-456',
    created_at: '2024-01-17T00:00:00Z',
    updated_at: '2024-01-17T00:00:00Z'
  }
];

const defaultProps = {
  songs: mockSongs,
  onSearch: jest.fn(),
};

describe('SongSearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input', () => {
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should show dropdown when input is focused', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText('Wonderwall')).toBeInTheDocument();
    expect(screen.getByText('Hotel California')).toBeInTheDocument();
    expect(screen.getByText('Stairway to Heaven')).toBeInTheDocument();
  });

  it('should filter songs when typing', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    await user.type(searchInput, 'wonder');
    
    expect(screen.getByText('Wonderwall')).toBeInTheDocument();
    expect(screen.queryByText('Hotel California')).not.toBeInTheDocument();
    expect(screen.queryByText('Stairway to Heaven')).not.toBeInTheDocument();
  });

  it('should call onSearch when typing', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.type(searchInput, 'wonder');
    
    expect(defaultProps.onSearch).toHaveBeenCalledWith('wonder');
  });

  it('should select a song when clicked', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    
    const wonderwallOption = screen.getByText('Wonderwall');
    await user.click(wonderwallOption);
    
    expect(searchInput).toHaveValue('Wonderwall');
    expect(defaultProps.onSearch).toHaveBeenCalledWith('Wonderwall');
  });

  it('should select "None" option to clear search', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    
    const noneOption = screen.getByText('None');
    await user.click(noneOption);
    
    expect(searchInput).toHaveValue('');
    expect(defaultProps.onSearch).toHaveBeenCalledWith('');
  });

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    
    expect(screen.getByText('Wonderwall')).toBeInTheDocument();
    
    // Click outside the component
    fireEvent.mouseDown(document.body);
    
    await waitFor(() => {
      expect(screen.queryByText('Wonderwall')).not.toBeInTheDocument();
    });
  });

  it('should sort songs alphabetically', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    
    const options = screen.getAllByText(/Hotel California|Stairway to Heaven|Wonderwall/);
    expect(options).toHaveLength(3);
  });

  it('should display song title and author in dropdown', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    
    expect(screen.getByText('Wonderwall')).toBeInTheDocument();
    expect(screen.getByText('Oasis')).toBeInTheDocument();
    expect(screen.getByText('Hotel California')).toBeInTheDocument();
    expect(screen.getByText('Eagles')).toBeInTheDocument();
  });

  it('should handle empty songs array', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar songs={[]} onSearch={jest.fn()} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.queryByText('Wonderwall')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    expect(searchInput).toHaveClass(
      'w-full',
      'px-3',
      'sm:px-4',
      'py-2',
      'text-sm',
      'sm:text-base',
      'border',
      'border-gray-300',
      'rounded-lg',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500'
    );
  });

  it('should handle case-insensitive search', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    await user.type(searchInput, 'WONDER');
    
    expect(screen.getByText('Wonderwall')).toBeInTheDocument();
    expect(screen.queryByText('Hotel California')).not.toBeInTheDocument();
  });

  it('should handle partial matches', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    await user.type(searchInput, 'wall');
    
    expect(screen.getByText('Wonderwall')).toBeInTheDocument();
  });

  it('should show "Show all songs" text for None option', async () => {
    const user = userEvent.setup();
    render(<SongSearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search songs...');
    await user.click(searchInput);
    
    expect(screen.getByText('Show all songs')).toBeInTheDocument();
  });
}); 