import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongCardMobile } from '@/app/dashboard/songs/@components/SongCardMobile';
import { Song } from '@/types/Song';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
  }),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock supabase client
const mockDelete = jest.fn();
jest.mock('@/utils/supabase/clients/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      delete: mockDelete.mockReturnValue({
        eq: jest.fn(() => ({
          error: null,
        })),
      }),
    })),
  })),
}));

const mockSong: Song = {
  id: '1',
  title: 'Test Song',
  author: 'Test Author',
  level: 'beginner',
  key: 'C',
  chords: 'C G Am F',
  audio_files: 'test.mp3',
  ultimate_guitar_link: 'https://ultimate-guitar.com/test',
  short_title: 'test',
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-15'),
};

describe('SongCardMobile', () => {
  const defaultProps = {
    song: mockSong,
    actions: ['view', 'edit', 'delete'] as ('view' | 'edit' | 'delete')[],
    showStatus: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render song information correctly', () => {
    render(<SongCardMobile {...defaultProps} />);
    
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('should render all action buttons when all actions are provided', () => {
    render(<SongCardMobile {...defaultProps} />);
    
    expect(screen.getByLabelText('View')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
  });

  it('should render only specified actions', () => {
    render(<SongCardMobile {...defaultProps} actions={['view']} />);
    
    expect(screen.getByLabelText('View')).toBeInTheDocument();
    expect(screen.queryByLabelText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
  });

  it('should navigate to song detail page when view button is clicked', async () => {
    const user = userEvent.setup();
    render(<SongCardMobile {...defaultProps} />);
    
    const viewButton = screen.getByLabelText('View');
    await user.click(viewButton);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/songs/1');
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<SongCardMobile {...defaultProps} />);
    
    const editButton = screen.getByLabelText('Edit');
    await user.click(editButton);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/songs/1/edit');
  });

  it('should open delete dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<SongCardMobile {...defaultProps} />);
    
    const deleteButton = screen.getByLabelText('Delete');
    await user.click(deleteButton);
    
    // Should show delete dialog
    expect(screen.getByText('Are you sure you want to delete this song?')).toBeInTheDocument();
    expect(screen.getByText('This will permanently delete "Test Song". This action cannot be undone.')).toBeInTheDocument();
  });

  it('should handle song deletion successfully', async () => {
    const user = userEvent.setup();
    render(<SongCardMobile {...defaultProps} />);
    
    // Click delete button
    const deleteButton = screen.getByLabelText('Delete');
    await user.click(deleteButton);
    
    // Click confirm delete
    const confirmButton = screen.getByText('Delete');
    await user.click(confirmButton);
    
    expect(mockDelete).toHaveBeenCalled();
  });

  it('should close delete dialog when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<SongCardMobile {...defaultProps} />);
    
    // Click delete button
    const deleteButton = screen.getByLabelText('Delete');
    await user.click(deleteButton);
    
    // Click cancel
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    // Dialog should be closed
    expect(screen.queryByText('Are you sure you want to delete this song?')).not.toBeInTheDocument();
  });

  it('should format date correctly', () => {
    const songWithStringDate = {
      ...mockSong,
      updated_at: '2024-01-15T00:00:00.000Z',
    };
    
    render(<SongCardMobile {...defaultProps} song={songWithStringDate} />);
    
    expect(screen.getByText('1/15/2024')).toBeInTheDocument();
  });

  it('should apply correct CSS classes for styling', () => {
    render(<SongCardMobile {...defaultProps} />);
    
    const card = screen.getByText('Test Song').closest('div');
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-4');
    
    const viewButton = screen.getByLabelText('View');
    expect(viewButton).toHaveClass('hover:scale-110', 'transition-transform', 'hover:bg-admin-blue-light');
    
    const editButton = screen.getByLabelText('Edit');
    expect(editButton).toHaveClass('hover:scale-110', 'transition-transform', 'hover:bg-admin-green-light');
    
    const deleteButton = screen.getByLabelText('Delete');
    expect(deleteButton).toHaveClass('hover:scale-110', 'transition-transform', 'hover:bg-admin-gray-light');
  });

  it('should handle different song properties', () => {
    const songWithStatus = {
      ...mockSong,
      status: 'started',
    };
    
    render(<SongCardMobile {...defaultProps} song={songWithStatus} showStatus={true} />);
    
    expect(screen.getByText('started')).toBeInTheDocument();
  });

  it('should handle songs with missing properties gracefully', () => {
    const incompleteSong = {
      ...mockSong,
      author: '',
      level: '',
      key: '',
    };
    
    render(<SongCardMobile {...defaultProps} song={incompleteSong} />);
    
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    // Should not crash with empty properties
  });

  it('should display chords information', () => {
    render(<SongCardMobile {...defaultProps} />);
    
    expect(screen.getByText('C G Am F')).toBeInTheDocument();
  });

  it('should display audio files information', () => {
    render(<SongCardMobile {...defaultProps} />);
    
    expect(screen.getByText('test.mp3')).toBeInTheDocument();
  });

  it('should handle different action combinations', () => {
    const actions = ['view', 'edit'] as ('view' | 'edit')[];
    render(<SongCardMobile {...defaultProps} actions={actions} />);
    
    // Should only render view and edit buttons
    expect(screen.getByLabelText('View')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit')).toBeInTheDocument();
    expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
  });
}); 