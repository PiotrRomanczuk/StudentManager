import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardErrorSite } from '../../app/dashboard/@components/DashboardErrorSite';
import { handleCommonErrors } from '../../app/dashboard/@components/error-utils';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('DashboardErrorSite', () => {
  const defaultProps = {
    error: 'Test error message',
    errorType: 'unknown' as const,
  };

  it('renders error message correctly', () => {
    render(<DashboardErrorSite {...defaultProps} />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
  });

  it('displays correct error type styling', () => {
    render(<DashboardErrorSite error="Auth error" errorType="auth" />);
    
    expect(screen.getByText('Authentication Error')).toBeInTheDocument();
    expect(screen.getByText('You need to sign in to access this page')).toBeInTheDocument();
  });

  it('shows status code when provided', () => {
    render(<DashboardErrorSite {...defaultProps} statusCode={404} />);
    
    expect(screen.getByText('Status: 404')).toBeInTheDocument();
  });

  it('shows error ID when provided', () => {
    render(<DashboardErrorSite {...defaultProps} errorId="TEST-123" />);
    
    expect(screen.getByText('Error ID: TEST-123')).toBeInTheDocument();
  });

  it('shows additional info when provided', () => {
    render(<DashboardErrorSite {...defaultProps} additionalInfo="Helpful information" />);
    
    expect(screen.getByText('Additional Information')).toBeInTheDocument();
    expect(screen.getByText('Helpful information')).toBeInTheDocument();
  });

  it('handles retry action correctly', async () => {
    const mockRetryAction = jest.fn();
    render(<DashboardErrorSite {...defaultProps} retryAction={mockRetryAction} />);
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    
    expect(mockRetryAction).toHaveBeenCalled();
  });

  it('shows loading state during retry', async () => {
    const mockRetryAction = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<DashboardErrorSite {...defaultProps} retryAction={mockRetryAction} />);
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    
    // Button should be disabled during retry
    expect(retryButton).toBeDisabled();
  });

  it('renders navigation buttons when enabled', () => {
    render(
      <DashboardErrorSite 
        {...defaultProps} 
        showHomeButton={true}
        showBackButton={true}
        backUrl="/dashboard"
      />
    );
    
    expect(screen.getByText('Dashboard Home')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('does not render navigation buttons when disabled', () => {
    render(
      <DashboardErrorSite 
        {...defaultProps} 
        showHomeButton={false}
        showBackButton={false}
      />
    );
    
    expect(screen.queryByText('Dashboard Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Go Back')).not.toBeInTheDocument();
  });
});

describe('Error Utilities', () => {
  it('determines auth error type correctly', () => {
    const result = handleCommonErrors('Please sign in to view your dashboard');
    expect(result.errorType).toBe('auth');
  });

  it('determines network error type correctly', () => {
    const result = handleCommonErrors('Network connection failed');
    expect(result.errorType).toBe('network');
  });

  it('determines permission error type correctly', () => {
    const result = handleCommonErrors('Access denied');
    expect(result.errorType).toBe('permission');
  });

  it('determines data error type correctly', () => {
    const result = handleCommonErrors('Data not found');
    expect(result.errorType).toBe('data');
  });

  it('determines server error type correctly', () => {
    const result = handleCommonErrors('Internal server error');
    expect(result.errorType).toBe('server');
  });

  it('generates unique error IDs', () => {
    const result1 = handleCommonErrors('Error 1');
    const result2 = handleCommonErrors('Error 2');
    
    expect(result1.errorId).toBeDefined();
    expect(result2.errorId).toBeDefined();
    expect(result1.errorId).not.toBe(result2.errorId);
  });

  it('includes context in error message', () => {
    const result = handleCommonErrors('Database error', 'Failed to load songs');
    expect(result.error).toBe('Failed to load songs: Database error');
  });
}); 