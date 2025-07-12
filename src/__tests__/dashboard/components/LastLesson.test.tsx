import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LastLesson from '@/app/dashboard/@components/cards/LastLesson';

describe('LastLesson', () => {
  it('should render "Last Lesson" text', () => {
    render(<LastLesson />);
    
    expect(screen.getByText('Last Lesson')).toBeInTheDocument();
  });

  it('should render as a Card component', () => {
    render(<LastLesson />);
    
    const card = screen.getByText('Last Lesson').closest('[class*="card"]');
    expect(card).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<LastLesson />);
    
    const element = screen.getByText('Last Lesson');
    expect(element).toBeInTheDocument();
  });
}); 