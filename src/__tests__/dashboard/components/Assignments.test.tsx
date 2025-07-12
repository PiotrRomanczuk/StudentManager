import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Assignments } from '@/app/dashboard/@components/admin/Assignments';

describe('Assignments', () => {
  it('should render assignments title', () => {
    render(<Assignments />);
    
    expect(screen.getByText('Recent Assignments')).toBeInTheDocument();
  });

  it('should render assignment items', () => {
    render(<Assignments />);
    
    expect(screen.getByText('G Major Scale Practice')).toBeInTheDocument();
    expect(screen.getByText('Blues Progression Practice')).toBeInTheDocument();
    expect(screen.getByText('Classical Piece - Romanza')).toBeInTheDocument();
  });

  it('should display student names', () => {
    render(<Assignments />);
    
    // Check that student names are present in the component
    expect(screen.getByText(/Sarah Williams/)).toBeInTheDocument();
    expect(screen.getByText(/Michael Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Alex Thompson/)).toBeInTheDocument();
  });

  it('should display due dates', () => {
    render(<Assignments />);
    
    expect(screen.getByText(/Due Jun 10/)).toBeInTheDocument();
    expect(screen.getByText(/Due Jun 12/)).toBeInTheDocument();
    expect(screen.getByText(/Due Jun 5/)).toBeInTheDocument();
  });

  it('should display status badges', () => {
    render(<Assignments />);
    
    // Use getAllByText since there are multiple badges
    const completedBadges = screen.getAllByText('Completed');
    const inProgressBadges = screen.getAllByText('In Progress');
    const overdueBadges = screen.getAllByText('Overdue');
    expect(completedBadges.length).toBeGreaterThan(0);
    expect(inProgressBadges.length).toBeGreaterThan(0);
    expect(overdueBadges.length).toBeGreaterThan(0);
  });

  it('should have proper status badge styling', () => {
    render(<Assignments />);
    
    const completedBadges = screen.getAllByText('Completed');
    const inProgressBadges = screen.getAllByText('In Progress');
    const overdueBadges = screen.getAllByText('Overdue');
    // Check the first badge of each type
    expect(completedBadges[0]).toHaveClass('bg-green-100', 'text-green-700');
    expect(inProgressBadges[0]).toHaveClass('bg-yellow-100', 'text-yellow-700');
    expect(overdueBadges[0]).toHaveClass('bg-red-100', 'text-red-700');
  });

  it('should render view all button', () => {
    render(<Assignments />);
    
    expect(screen.getByText('View all assignments →')).toBeInTheDocument();
  });

  it('should have proper container styling', () => {
    render(<Assignments />);
    
    const container = screen.getByText('Recent Assignments').closest('.bg-white');
    expect(container).toHaveClass('bg-white', 'rounded-xl', 'shadow');
  });

  it('should have proper list styling', () => {
    render(<Assignments />);
    
    const list = screen.getByText('Recent Assignments').nextElementSibling;
    expect(list).toHaveClass('divide-y', 'divide-gray-100');
  });
}); 