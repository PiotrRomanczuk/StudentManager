import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteSongDialog } from '@/app/dashboard/songs/@components/DeleteSongDialog';

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

describe('DeleteSongDialog', () => {
  const defaultProps = {
    songId: '1',
    songTitle: 'Test Song',
    isOpen: true,
    onClose: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the delete dialog when open', () => {
    render(<DeleteSongDialog {...defaultProps} />);
    
    expect(screen.getByText('Are you sure you want to delete this song?')).toBeInTheDocument();
    expect(screen.getByText('This will permanently delete "Test Song". This action cannot be undone.')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<DeleteSongDialog {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Are you sure you want to delete this song?')).not.toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<DeleteSongDialog {...defaultProps} onClose={onClose} />);
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    render(<DeleteSongDialog {...defaultProps} onDelete={onDelete} />);
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should handle song deletion through supabase', async () => {
    const user = userEvent.setup();
    render(<DeleteSongDialog {...defaultProps} />);
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(mockDelete).toHaveBeenCalled();
  });

  it('should handle deletion error', async () => {
    const mockError = { message: 'Delete failed' };
    mockDelete.mockReturnValue({
      eq: jest.fn(() => ({
        error: mockError,
      })),
    });

    const user = userEvent.setup();
    render(<DeleteSongDialog {...defaultProps} />);
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    expect(mockDelete).toHaveBeenCalled();
  });

  it('should display the correct song title in the message', () => {
    render(<DeleteSongDialog {...defaultProps} songTitle="Another Song" />);
    
    expect(screen.getByText('This will permanently delete "Another Song". This action cannot be undone.')).toBeInTheDocument();
  });

  it('should apply correct CSS classes for styling', () => {
    render(<DeleteSongDialog {...defaultProps} />);
    
    const dialog = screen.getByText('Are you sure you want to delete this song?').closest('div');
    expect(dialog).toHaveClass('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center');
    
    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toHaveClass('bg-gray-300', 'hover:bg-gray-400');
    
    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toHaveClass('bg-red-600', 'hover:bg-red-700');
  });

  it('should handle empty song title gracefully', () => {
    render(<DeleteSongDialog {...defaultProps} songTitle="" />);
    
    expect(screen.getByText('This will permanently delete "". This action cannot be undone.')).toBeInTheDocument();
  });

  it('should handle special characters in song title', () => {
    render(<DeleteSongDialog {...defaultProps} songTitle="Song with 'quotes' & symbols" />);
    
    expect(screen.getByText('This will permanently delete "Song with \'quotes\' & symbols". This action cannot be undone.')).toBeInTheDocument();
  });

  it('should close dialog after successful deletion', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<DeleteSongDialog {...defaultProps} onClose={onClose} />);
    
    const deleteButton = screen.getByText('Delete');
    await user.click(deleteButton);
    
    // Should call onClose after deletion
    expect(onClose).toHaveBeenCalled();
  });

  it('should handle keyboard events', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<DeleteSongDialog {...defaultProps} onClose={onClose} />);
    
    // Press Escape key
    await user.keyboard('{Escape}');
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should focus the delete button by default', () => {
    render(<DeleteSongDialog {...defaultProps} />);
    
    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toHaveFocus();
  });

  it('should handle different song IDs', () => {
    render(<DeleteSongDialog {...defaultProps} songId="123" />);
    
    expect(screen.getByText('Are you sure you want to delete this song?')).toBeInTheDocument();
  });
}); 