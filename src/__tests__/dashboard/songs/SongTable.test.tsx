import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { SongTable } from '@/app/dashboard/songs/@components/SongTable';
import { Song } from '@/types/Song';

// Mock the SongRow component
jest.mock('@/app/dashboard/songs/@components/SongRow', () => ({
  SongRow: ({ song, actions, showStatus }: any) => (
    <tr data-testid={`song-row-${song.id}`}>
      <td>{song.title}</td>
      {showStatus && <td>{song.status}</td>}
      <td>{song.level}</td>
      <td>{song.key}</td>
      <td>{new Date(song.updated_at).toLocaleDateString()}</td>
      <td>
        {actions.map((action: string) => (
          <button key={action} data-testid={`${action}-${song.id}`}>
            {action}
          </button>
        ))}
      </td>
    </tr>
  ),
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

const mockHeaders = [
  { key: 'title', label: 'Title' },
  { key: 'level', label: 'Level' },
  { key: 'key', label: 'Key' },
  { key: 'updated_at', label: 'Updated' },
];

describe('SongTable', () => {
  const defaultProps = {
    songs: mockSongs,
    headers: mockHeaders,
    actions: ['view', 'edit', 'delete'] as ('view' | 'edit' | 'delete')[],
    showStatus: false,
    onSort: jest.fn(),
    getSortIndicator: jest.fn(() => ''),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the table with correct structure', () => {
    render(<SongTable {...defaultProps} />);
    
    expect(screen.getByText('Songs Library')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render all headers correctly', () => {
    render(<SongTable {...defaultProps} />);
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('Key')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });

  it('should render all songs', () => {
    render(<SongTable {...defaultProps} />);
    
    expect(screen.getByTestId('song-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('song-row-2')).toBeInTheDocument();
  });

  it('should call onSort when header is clicked', () => {
    const onSort = jest.fn();
    render(<SongTable {...defaultProps} onSort={onSort} />);
    
    const titleHeader = screen.getByText('Title');
    fireEvent.click(titleHeader);
    
    expect(onSort).toHaveBeenCalledWith('title');
  });

  it('should display sort indicators when provided', () => {
    const getSortIndicator = jest.fn((key) => key === 'title' ? ' ↑' : '');
    render(<SongTable {...defaultProps} getSortIndicator={getSortIndicator} />);
    
    expect(getSortIndicator).toHaveBeenCalledWith('title');
    expect(getSortIndicator).toHaveBeenCalledWith('level');
    expect(getSortIndicator).toHaveBeenCalledWith('key');
    expect(getSortIndicator).toHaveBeenCalledWith('updated_at');
  });

  it('should render actions column when actions are provided', () => {
    render(<SongTable {...defaultProps} />);
    
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should not render actions column when no actions are provided', () => {
    render(<SongTable {...defaultProps} actions={[]} />);
    
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });

  it('should render action buttons for each song', () => {
    render(<SongTable {...defaultProps} />);
    
    expect(screen.getByTestId('view-1')).toBeInTheDocument();
    expect(screen.getByTestId('edit-1')).toBeInTheDocument();
    expect(screen.getByTestId('delete-1')).toBeInTheDocument();
    expect(screen.getByTestId('view-2')).toBeInTheDocument();
    expect(screen.getByTestId('edit-2')).toBeInTheDocument();
    expect(screen.getByTestId('delete-2')).toBeInTheDocument();
  });

  it('should handle empty songs array', () => {
    render(<SongTable {...defaultProps} songs={[]} />);
    
    expect(screen.getByText('Songs Library')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    // Should not render any song rows
    expect(screen.queryByTestId('song-row-1')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes for styling', () => {
    render(<SongTable {...defaultProps} />);
    
    const tableContainer = screen.getByRole('table').closest('div');
    expect(tableContainer).toHaveClass('overflow-auto');
    
    const heading = screen.getByText('Songs Library');
    expect(heading).toHaveClass('text-lg', 'font-semibold', 'mb-2', 'text-gray-800');
  });

  it('should handle different action combinations', () => {
    const actions = ['view'] as ('view')[];
    render(<SongTable {...defaultProps} actions={actions} />);
    
    // Should only render view buttons
    expect(screen.getByTestId('view-1')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-1')).not.toBeInTheDocument();
  });
}); 