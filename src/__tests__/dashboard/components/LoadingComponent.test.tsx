import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { LoadingComponent } from '@/app/dashboard/@components/LoadingComponent';

describe('LoadingComponent', () => {
  it('should render loading message', () => {
    const message = 'Loading...';
    render(<LoadingComponent message={message} />);
    
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should render with container styling', () => {
    render(<LoadingComponent message="Loading..." />);
    
    const loadingContainer = screen.getByText('Loading...').closest('div').parentElement;
    expect(loadingContainer).toHaveClass('container', 'max-w-4xl', 'mx-auto');
  });

  it('should handle custom loading message', () => {
    const customMessage = 'Please wait while we fetch your data...';
    render(<LoadingComponent message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('should handle long loading messages', () => {
    const longMessage = 'This is a very long loading message that should be displayed properly without breaking the layout or causing any issues with the component rendering';
    render(<LoadingComponent message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
}); 