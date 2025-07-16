import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { SongsTable } from '@/app/dashboard/tdd-songs/components/SongsTable';
import { Song } from '@/types/Song';

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

describe('SongsTable (responsive)', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  afterEach(() => {
    // Reset window size after each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('shows table layout on desktop', () => {
    // Mock desktop screen size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<SongsTable songs={mockSongs} onView={jest.fn()} />);

    // Should show table structure
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /author/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /level/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /key/i })).toBeInTheDocument();

    // Should show table rows
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header + data rows

    // Should not show card layout
    expect(screen.queryByTestId('song-card')).not.toBeInTheDocument();
  });

  it('shows card layout on mobile', () => {
    // Mock mobile screen size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });

    // Trigger resize event to ensure mobile detection
    window.dispatchEvent(new Event('resize'));

    render(<SongsTable songs={mockSongs} onView={jest.fn()} />);

    // Should show card structure
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    const songCards = screen.getAllByTestId('song-card');
    expect(songCards).toHaveLength(2);

    // Should show song information in cards
    expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    expect(screen.getByText('Test Song 2')).toBeInTheDocument();
    
    // Use within() to scope the search to specific cards to avoid conflicts with filter dropdowns
    const firstCard = songCards[0];
    expect(within(firstCard).getByText('Test Author 1')).toBeInTheDocument();
    expect(within(firstCard).getByText('beginner')).toBeInTheDocument();
    expect(within(firstCard).getByText('C')).toBeInTheDocument();
    
    const secondCard = songCards[1];
    expect(within(secondCard).getByText('Test Author 2')).toBeInTheDocument();
    expect(within(secondCard).getByText('intermediate')).toBeInTheDocument();
    expect(within(secondCard).getByText('G')).toBeInTheDocument();
  });

  it('maintains sorting functionality in both layouts', () => {
    // Test desktop sorting
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { rerender } = render(<SongsTable songs={mockSongs} onView={jest.fn()} />);

    // Desktop: click author header to sort
    const authorHeader = screen.getByRole('columnheader', { name: /author/i });
    fireEvent.click(authorHeader);

    // Should show sort indicator
    expect(authorHeader).toHaveAttribute('data-sort-direction', 'asc');

    // Test mobile sorting
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    // Trigger resize event to update mobile detection
    window.dispatchEvent(new Event('resize'));

    rerender(<SongsTable songs={mockSongs} onView={jest.fn()} />);

    // Mobile: should have sort controls
    expect(screen.getByText(/Sort by:/i)).toBeInTheDocument();
  });

  it('maintains pagination functionality in both layouts', () => {
    const manySongs = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      title: `Song ${i + 1}`,
      author: `Author ${i + 1}`,
      level: 'beginner',
      key: 'C',
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
    }));

    // Test desktop pagination with small window height
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 300, // Small height to force pagination
    });

    const { rerender } = render(<SongsTable songs={manySongs} onView={jest.fn()} />);

    // Desktop: should have pagination controls
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();

    // Test mobile pagination with small window height
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 300, // Small height to force pagination
    });

    rerender(<SongsTable songs={manySongs} onView={jest.fn()} />);

    // Mobile: should have pagination controls
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('maintains action functionality in both layouts', () => {
    const mockOnView = jest.fn();

    // Test desktop actions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { rerender } = render(<SongsTable songs={mockSongs} onView={mockOnView} />);

    // Desktop: click view button
    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    fireEvent.click(viewButtons[0]);
    expect(mockOnView).toHaveBeenCalledWith(mockSongs[0]);

    // Test mobile actions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    rerender(<SongsTable songs={mockSongs} onView={mockOnView} />);

    // Mobile: click view button on card
    const mobileViewButtons = screen.getAllByRole('button', { name: /view/i });
    fireEvent.click(mobileViewButtons[0]);
    expect(mockOnView).toHaveBeenCalledWith(mockSongs[0]);
  });

  it('shows empty state in both layouts', () => {
    // Test desktop empty state
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { rerender } = render(<SongsTable songs={[]} onView={jest.fn()} />);

    // Desktop: should show empty message
    expect(screen.getByText(/no songs found/i)).toBeInTheDocument();

    // Test mobile empty state
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    rerender(<SongsTable songs={[]} onView={jest.fn()} />);

    // Mobile: should show empty message
    expect(screen.getByText(/no songs found/i)).toBeInTheDocument();
  });
}); 