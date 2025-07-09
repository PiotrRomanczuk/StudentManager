import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  it('should render navbar with logo', () => {
    render(<Navbar />);
    
    expect(screen.getByText(/student manager/i)).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /features/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('should render authentication buttons', () => {
    render(<Navbar />);
    
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should toggle mobile menu when hamburger button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    const hamburgerButton = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(hamburgerButton);
    
    // Mobile menu should be visible
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should close mobile menu when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    const hamburgerButton = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(hamburgerButton);
    
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    await user.click(closeButton);
    
    // Mobile menu should be hidden
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should have proper navigation links with correct hrefs', () => {
    render(<Navbar />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    const featuresLink = screen.getByRole('link', { name: /features/i });
    const pricingLink = screen.getByRole('link', { name: /pricing/i });
    const contactLink = screen.getByRole('link', { name: /contact/i });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(featuresLink).toHaveAttribute('href', '/#features');
    expect(pricingLink).toHaveAttribute('href', '/#pricing');
    expect(contactLink).toHaveAttribute('href', '/#contact');
  });

  it('should have proper auth links with correct hrefs', () => {
    render(<Navbar />);
    
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    
    expect(signInLink).toHaveAttribute('href', '/auth/signin');
    expect(signUpLink).toHaveAttribute('href', '/auth/signup');
  });
}); 