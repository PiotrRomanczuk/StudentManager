import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NoSongsFound from '@/app/dashboard/@components/NoSongsFound';

describe('NoSongsFound', () => {
  it('should render no songs found message', () => {
    render(<NoSongsFound />);
    
    expect(screen.getByText(/no songs found/i)).toBeInTheDocument();
  });
}); 