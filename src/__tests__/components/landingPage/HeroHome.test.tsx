import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroHome from '@/components/landingPage/hero/HeroHome';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
}));

describe('HeroHome', () => {
  it('should render hero title', () => {
    render(<HeroHome />);
    
    expect(screen.getByText(/manage your music lessons/i)).toBeInTheDocument();
  });

  it('should render hero subtitle', () => {
    render(<HeroHome />);
    
    expect(screen.getByText(/streamline your music education/i)).toBeInTheDocument();
  });

  it('should render call-to-action buttons', () => {
    render(<HeroHome />);
    
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument();
  });

  it('should have proper CTA button links', () => {
    render(<HeroHome />);
    
    const getStartedButton = screen.getByRole('link', { name: /get started/i });
    const learnMoreButton = screen.getByRole('link', { name: /learn more/i });
    
    expect(getStartedButton).toHaveAttribute('href', '/auth/signup');
    expect(learnMoreButton).toHaveAttribute('href', '/#features');
  });

  it('should render hero image', () => {
    render(<HeroHome />);
    
    const heroImage = screen.getByAltText(/hero image/i);
    expect(heroImage).toBeInTheDocument();
  });

  it('should have proper button styling', () => {
    render(<HeroHome />);
    
    const getStartedButton = screen.getByRole('link', { name: /get started/i });
    const learnMoreButton = screen.getByRole('link', { name: /learn more/i });
    
    expect(getStartedButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
    expect(learnMoreButton).toHaveClass('border', 'border-gray-300');
  });

  it('should be responsive with proper classes', () => {
    render(<HeroHome />);
    
    const heroSection = screen.getByText(/manage your music lessons/i).closest('section');
    expect(heroSection).toHaveClass('min-h-screen', 'flex', 'items-center');
  });
}); 