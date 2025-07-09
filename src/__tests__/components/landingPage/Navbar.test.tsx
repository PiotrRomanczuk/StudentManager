import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Navbar from '@/components/landingPage/navbar/Navbar';

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
  usePathname() {
    return '/'
  },
}));

describe('Navbar', () => {
  it('should render navbar with logo image', () => {
    render(<Navbar />);
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /signin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /signup/i })).toBeInTheDocument();
  });

  it('should have proper navigation links with correct hrefs', () => {
    render(<Navbar />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    const signInLink = screen.getByRole('link', { name: /signin/i });
    const signUpLink = screen.getByRole('link', { name: /signup/i });
    expect(homeLink).toHaveAttribute('href', '/');
    expect(signInLink).toHaveAttribute('href', '/auth/signin');
    expect(signUpLink).toHaveAttribute('href', '/auth/signup');
  });
}); 