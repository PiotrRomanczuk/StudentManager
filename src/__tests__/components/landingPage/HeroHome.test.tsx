import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroHome from '@/components/landingPage/hero/HeroHome';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}));

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
    
    // Check for the heading element that contains the title
    const titleHeading = screen.getByRole('heading', { name: /master the art of guitar teaching/i });
    expect(titleHeading).toBeInTheDocument();
  });

  it('should render hero subtitle', () => {
    render(<HeroHome />);
    
    expect(screen.getByText(/transform your guitar teaching studio/i)).toBeInTheDocument();
  });

  it('should render call-to-action buttons', () => {
    render(<HeroHome />);
    
    expect(screen.getByRole('link', { name: /get started free/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /documentation/i })).toBeInTheDocument();
  });

  it('should have proper CTA button links', () => {
    render(<HeroHome />);
    
    const getStartedButton = screen.getByRole('link', { name: /get started free/i });
    const documentationButton = screen.getByRole('link', { name: /documentation/i });
    
    expect(getStartedButton).toHaveAttribute('href', '/auth/signin');
    expect(documentationButton).toHaveAttribute('href', '/documentation');
  });

  it('should render hero image', () => {
    render(<HeroHome />);
    
    const heroImage = screen.getByAltText(/dashboard preview/i);
    expect(heroImage).toBeInTheDocument();
  });

  it('should have proper button styling', () => {
    render(<HeroHome />);
    
    const getStartedButton = screen.getByRole('link', { name: /get started free/i });
    const documentationButton = screen.getByRole('link', { name: /documentation/i });
    
    expect(getStartedButton).toHaveClass('bg-indigo-600', 'hover:bg-indigo-500');
    expect(documentationButton).toHaveClass('text-gray-900');
  });

  it('should be responsive with proper classes', () => {
    render(<HeroHome />);
    
    // Use a more specific selector to find the section element
    const heroSection = document.querySelector('section[id="hero"]');
    expect(heroSection).toHaveClass('relative', 'overflow-hidden');
  });
}); 