import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Stats } from '@/app/dashboard/@components/admin/Stats';

describe('Stats', () => {
  it('should render all stat cards', () => {
    render(<Stats />);
    
    expect(screen.getByText('Total Students')).toBeInTheDocument();
    expect(screen.getByText('Lessons This Week')).toBeInTheDocument();
    expect(screen.getByText('Pending Assignments')).toBeInTheDocument();
    expect(screen.getByText('Progress Rate')).toBeInTheDocument();
  });

  it('should display correct stat values', () => {
    render(<Stats />);
    
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
  });

  it('should display change indicators', () => {
    render(<Stats />);
    
    expect(screen.getByText('+3')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByText('-2')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });

  it('should have proper grid layout', () => {
    render(<Stats />);
    
    const gridContainer = screen.getByText('Total Students').closest('.grid');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4');
  });

  it('should have proper card styling', () => {
    render(<Stats />);
    
    const firstCard = screen.getByText('Total Students').closest('.bg-white');
    expect(firstCard).toHaveClass('bg-white', 'rounded-xl', 'shadow');
  });

  it('should display stat labels with proper styling', () => {
    render(<Stats />);
    
    const labels = screen.getAllByText(/Total Students|Lessons This Week|Pending Assignments|Progress Rate/);
    labels.forEach(label => {
      expect(label).toHaveClass('text-gray-500', 'text-sm');
    });
  });

  it('should display stat values with proper styling', () => {
    render(<Stats />);
    
    const values = screen.getAllByText(/28|14|9|78%/);
    values.forEach(value => {
      expect(value).toHaveClass('text-2xl', 'font-bold');
    });
  });

  it('should display change indicators with proper colors', () => {
    render(<Stats />);
    
    const positiveChanges = screen.getAllByText(/\+/);
    const negativeChanges = screen.getAllByText(/-/);
    
    positiveChanges.forEach(change => {
      expect(change).toHaveClass('text-green-600');
    });
    
    negativeChanges.forEach(change => {
      expect(change).toHaveClass('text-red-600');
    });
  });

  it('should have proper gap between cards', () => {
    render(<Stats />);
    
    const gridContainer = screen.getByText('Total Students').closest('.grid');
    expect(gridContainer).toHaveClass('gap-4');
  });

  it('should have proper margin bottom', () => {
    render(<Stats />);
    
    const container = screen.getByText('Total Students').closest('.mb-8');
    expect(container).toHaveClass('mb-8');
  });

  it('should be responsive', () => {
    render(<Stats />);
    
    const gridContainer = screen.getByText('Total Students').closest('.grid');
    expect(gridContainer).toHaveClass('grid-cols-2', 'md:grid-cols-4');
  });
}); 