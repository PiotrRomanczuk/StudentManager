import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorComponent } from '@/components/dashboard/ErrorComponent';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('ErrorComponent', () => {
  it('should render error message', () => {
    const errorMessage = 'Something went wrong';
    render(<ErrorComponent error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render try again button', () => {
    render(<ErrorComponent error="Test error" />);
    
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    expect(tryAgainButton).toBeInTheDocument();
  });

  it('should handle long error messages', () => {
    const longError = 'This is a very long error message that should be displayed properly without breaking the layout or causing any issues with the component rendering';
    render(<ErrorComponent error={longError} />);
    
    expect(screen.getByText(longError)).toBeInTheDocument();
  });

  it('should call loadSongs function when try again is clicked', async () => {
    const loadSongs = jest.fn();
    const user = userEvent.setup();
    
    render(<ErrorComponent error="Test error" loadSongs={loadSongs} />);
    
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    await user.click(tryAgainButton);
    
    expect(loadSongs).toHaveBeenCalledTimes(1);
  });

  it('should not crash when loadSongs is not provided', async () => {
    const user = userEvent.setup();
    
    render(<ErrorComponent error="Test error" />);
    
    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    await user.click(tryAgainButton);
    
    // Should not throw an error
    expect(tryAgainButton).toBeInTheDocument();
  });
}); 