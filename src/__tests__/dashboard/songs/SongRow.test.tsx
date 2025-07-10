import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongRow } from '@/app/dashboard/songs/@components/SongRow';
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

describe('SongRow', () => {
  const defaultProps = {
    song: mockSong,
    actions: ['view', 'edit', 'delete'] as ('view' | 'edit' | 'delete')[],
    showStatus: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render song information correctly', () => {
    render(<SongRow {...defaultProps} />);
    
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('1/15/2024')).toBeInTheDocument(); // updated_at date
  });

  it('should render all action buttons when all actions are provided', () => {
    render(<SongRow {...defaultProps} />);
    
    expect(screen.getByLabelText('View')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
  });

  it('should render only specified actions', () => {
    render(<SongRow {...defaultProps} actions={['view']} />);
    
    expect(screen.getByLabelText('View')).toBeInTheDocument();
    expect(screen.queryByLabelText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
  });

  it('should navigate to song detail page when view button is clicked', async () => {
    const user = userEvent.setup();
    render(<SongRow {...defaultProps} />);
    
    const viewButton = screen.getByLabelText('View');
    await user.click(viewButton);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/songs/1');
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<SongRow {...defaultProps} />);
    
    const editButton = screen.getByLabelText('Edit');
    await user.click(editButton);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard/songs/1/edit');
  });

  it('should open delete dialog when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<SongRow {...defaultProps} />);
    
    const deleteButton = screen.getByLabelText('Delete');
    await user.click(deleteButton);
    
    // Should show delete dialog
    expect(screen.getByText('Are you sure you want to delete this song?')).toBeInTheDocument();
    expect(screen.getByText('This will permanently delete "Test Song". This action cannot be undone.')).toBeInTheDocument();
  });

  it('should handle song deletion successfully', async () => {
    const user = userEvent.setup();
    render(<SongRow {...defaultProps} />);
    
    // Click delete button
    const deleteButton = screen.getByLabelText('Delete');
    await user.click(deleteButton);
    
    // Click confirm delete
    const confirmButton = screen.getByText('Delete');
    await user.click(confirmButton);
    
    expect(mockDelete).toHaveBeenCalled();
  });

  it('should handle song deletion error', async () => {
    const mockError = { message: 'Delete failed' };
    mockDelete.mockReturnValue({
      eq: jest.fn(() => ({
        error: mockError,
      })),
    });

    const user = userEvent.setup();
    render(<SongRow {...defaultProps} />);
    
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
    render(<SongRow {...defaultProps} />);
    
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
    
    render(<SongRow {...defaultProps} song={songWithStringDate} />);
    
    expect(screen.getByText('1/15/2024')).toBeInTheDocument();
  });

  it('should handle empty date gracefully', () => {
    const songWithEmptyDate = {
      ...mockSong,
      updated_at: '',
    };
    
    render(<SongRow {...defaultProps} song={songWithEmptyDate} />);
    
    // Should not crash and should show empty string or default value
    expect(screen.getByText('Test Song')).toBeInTheDocument();
  });

  it('should apply correct CSS classes for styling', () => {
    render(<SongRow {...defaultProps} />);
    
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
    
    render(<SongRow {...defaultProps} song={songWithStatus} showStatus={true} />);
    
    expect(screen.getByText('started')).toBeInTheDocument();
  });
}); 