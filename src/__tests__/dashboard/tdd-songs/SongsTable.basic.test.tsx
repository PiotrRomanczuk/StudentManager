import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { SongsTable } from '@/app/dashboard/tdd-songs/components/SongsTable';
import { Song } from '@/types/Song';

// Mock window object for responsive design
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024, // Desktop width
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768, // Desktop height
});

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Test Song 1',
    author: 'Test Author 1',
    level: 'beginner',
    key: 'C',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Test Song 2',
    author: 'Test Author 2',
    level: 'intermediate',
    key: 'G',
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-16'),
  },
];

describe('SongsTable (basic)', () => {
  it('should render a table with songs', () => {
    render(<SongsTable songs={mockSongs} onView={jest.fn()} />);
    
    // Wait for the component to render and check for song titles
    expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    expect(screen.getByText('Test Song 2')).toBeInTheDocument();
    
    // Check for author names in the table (not the filter dropdown)
    const authorElements = screen.getAllByText('Test Author 1');
    expect(authorElements.length).toBeGreaterThan(0);
    
    const authorElements2 = screen.getAllByText('Test Author 2');
    expect(authorElements2.length).toBeGreaterThan(0);
    
    // Check for level badges specifically in the table body
    const levelBadges = screen.getAllByText(/beginner|intermediate/);
    expect(levelBadges.length).toBeGreaterThanOrEqual(2);
    
    // Check for keys (they appear in both filter dropdown and table cells)
    const keyElements = screen.getAllByText(/C|G/);
    expect(keyElements.length).toBeGreaterThanOrEqual(2);
  });

  it('should display "No songs found" when songs array is empty', () => {
    render(<SongsTable songs={[]} onView={jest.fn()} />);
    expect(screen.getByText('No songs found')).toBeInTheDocument();
  });

  it('should not display table headers when songs array is empty', () => {
    render(<SongsTable songs={[]} onView={jest.fn()} />);
    expect(screen.queryByText(/^Title/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Author/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Level/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Key/)).not.toBeInTheDocument();
  });
}); 