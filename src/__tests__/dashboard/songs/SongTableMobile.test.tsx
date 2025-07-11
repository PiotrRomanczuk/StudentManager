import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongTableMobile } from '@/app/dashboard/songs/@components/SongTableMobile';
import { Song } from '@/types/Song';

// Mock the SongCardMobile component
jest.mock('@/app/dashboard/songs/@components/SongCardMobile', () => ({
  SongCardMobile: ({ song, actions, showStatus }: any) => (
    <div data-testid={`mobile-card-${song.id}`}>
      <div>{song.title}</div>
      <div>{song.level}</div>
      <div>{song.key}</div>
      {actions.map((action: string) => (
        <button key={action} data-testid={`mobile-${action}-${song.id}`}>
          {action}
        </button>
      ))}
    </div>
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

describe('SongTableMobile', () => {
  const defaultProps = {
    songs: mockSongs,
    actions: ['view', 'edit', 'delete'] as ('view' | 'edit' | 'delete')[],
    showStatus: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the mobile table with songs', () => {
    render(<SongTableMobile {...defaultProps} />);
    
    expect(screen.getByTestId('mobile-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-2')).toBeInTheDocument();
  });

  it('should render all action buttons for each song', () => {
    render(<SongTableMobile {...defaultProps} />);
    
    expect(screen.getByTestId('mobile-view-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-edit-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-delete-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-view-2')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-edit-2')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-delete-2')).toBeInTheDocument();
  });

  it('should render only specified actions', () => {
    render(<SongTableMobile {...defaultProps} actions={['view']} />);
    
    expect(screen.getByTestId('mobile-view-1')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-edit-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-delete-1')).not.toBeInTheDocument();
  });

  it('should handle empty songs array', () => {
    render(<SongTableMobile {...defaultProps} songs={[]} />);
    
    expect(screen.queryByTestId('mobile-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-card-2')).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes for styling', () => {
    render(<SongTableMobile {...defaultProps} />);
    
    const container = screen.getByTestId('mobile-card-1').closest('div');
    expect(container).toHaveClass('space-y-4');
  });

  it('should display song information correctly', () => {
    render(<SongTableMobile {...defaultProps} />);
    
    expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('Test Song 2')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();
  });

  it('should handle different action combinations', () => {
    const actions = ['view', 'edit'] as ('view' | 'edit')[];
    render(<SongTableMobile {...defaultProps} actions={actions} />);
    
    // Should only render view and edit buttons
    expect(screen.getByTestId('mobile-view-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-edit-1')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-delete-1')).not.toBeInTheDocument();
  });

  it('should handle showStatus prop correctly', () => {
    render(<SongTableMobile {...defaultProps} showStatus={true} />);
    
    // The component should handle the showStatus prop
    expect(screen.getByTestId('mobile-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-2')).toBeInTheDocument();
  });

  it('should render songs in correct order', () => {
    render(<SongTableMobile {...defaultProps} />);
    
    const cards = screen.getAllByTestId(/mobile-card-/);
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveAttribute('data-testid', 'mobile-card-1');
    expect(cards[1]).toHaveAttribute('data-testid', 'mobile-card-2');
  });

  it('should handle songs with missing properties gracefully', () => {
    const incompleteSong = {
      id: '3',
      title: 'Incomplete Song',
      author: '',
      level: '',
      key: '',
      chords: '',
      audio_files: '',
      ultimate_guitar_link: '',
      short_title: '',
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    render(<SongTableMobile {...defaultProps} songs={[incompleteSong]} />);
    
    expect(screen.getByTestId('mobile-card-3')).toBeInTheDocument();
    expect(screen.getByText('Incomplete Song')).toBeInTheDocument();
  });
}); 