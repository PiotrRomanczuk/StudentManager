import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorComponent } from '@/app/dashboard/@components/ErrorComponent';
import { toast } from 'sonner';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('ErrorComponent', () => {
  const mockLoadSongs = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render error message', () => {
    const errorMessage = 'Failed to load songs';
    render(<ErrorComponent error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render with alert styling', () => {
    render(<ErrorComponent error="Test error" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('mb-4');
  });

  it('should render try again button', () => {
    render(<ErrorComponent error="Test error" />);
    
    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toBeInTheDocument();
  });

  it('should call loadSongs when try again button is clicked', () => {
    render(<ErrorComponent error="Test error" loadSongs={mockLoadSongs} />);
    
    const button = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(button);
    
    expect(mockLoadSongs).toHaveBeenCalledTimes(1);
  });

  it('should show success toast when try again is clicked', () => {
    render(<ErrorComponent error="Test error" loadSongs={mockLoadSongs} />);
    
    const button = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(button);
    
    expect(toast.success).toHaveBeenCalledWith('Songs loaded again');
  });

  it('should not call loadSongs if not provided', () => {
    render(<ErrorComponent error="Test error" />);
    
    const button = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(button);
    
    expect(mockLoadSongs).not.toHaveBeenCalled();
  });

  it('should render with container styling', () => {
    render(<ErrorComponent error="Test error" />);
    
    const container = screen.getByText('Test error').closest('.container');
    expect(container).toHaveClass('container', 'mx-auto', 'max-w-4xl');
  });

  it('should handle long error messages', () => {
    const longError = 'This is a very long error message that should be displayed properly without breaking the layout or causing any issues with the component rendering and should be handled gracefully';
    render(<ErrorComponent error={longError} />);
    
    expect(screen.getByText(longError)).toBeInTheDocument();
  });

  it('should handle special characters in error messages', () => {
    const specialError = 'Error with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    render(<ErrorComponent error={specialError} />);
    
    expect(screen.getByText(specialError)).toBeInTheDocument();
  });

  it('should handle empty error message', () => {
    render(<ErrorComponent error="" />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should handle undefined loadSongs function', () => {
    render(<ErrorComponent error="Test error" loadSongs={undefined} />);
    
    const button = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(button);
    
    // Should not throw error
    expect(button).toBeInTheDocument();
  });
}); 