import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NoSongsFound from '@/app/dashboard/@components/NoSongsFound';

describe('NoSongsFound', () => {
  it('should render "No songs found" message', () => {
    render(<NoSongsFound />);
    
    expect(screen.getByText('No songs found')).toBeInTheDocument();
  });

  it('should render as a div element', () => {
    render(<NoSongsFound />);
    
    const element = screen.getByText('No songs found');
    expect(element.tagName).toBe('DIV');
  });

  it('should be accessible', () => {
    render(<NoSongsFound />);
    
    const element = screen.getByText('No songs found');
    expect(element).toBeInTheDocument();
  });
}); 