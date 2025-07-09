import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NoSongsFound from '@/components/dashboard/NoSongsFound';

describe('NoSongsFound', () => {
  it('should render no songs found message', () => {
    render(<NoSongsFound />);
    
    expect(screen.getByText(/no songs found/i)).toBeInTheDocument();
  });

  it('should render with default styling', () => {
    render(<NoSongsFound />);
    
    const container = screen.getByText(/no songs found/i).closest('div');
    expect(container).toHaveClass('container', 'mx-auto', 'max-w-4xl');
  });

  it('should render add song button', () => {
    render(<NoSongsFound />);
    
    const addButton = screen.getByRole('button', { name: /add song/i });
    expect(addButton).toBeInTheDocument();
  });

  it('should render music icon', () => {
    render(<NoSongsFound />);
    
    // Check for the music icon (should be present in the component)
    const icon = screen.getByTestId('music-icon');
    expect(icon).toBeInTheDocument();
  });
}); 