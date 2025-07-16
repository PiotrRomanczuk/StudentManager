import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SongsTableSearch } from '@/app/dashboard/tdd-songs/components/SongsTableSearch';
import { Song } from '@/types/Song';

// Mock window object for responsive design
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024, // Desktop width
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
  {
    id: '3',
    title: 'Advanced Song',
    author: 'Advanced Author',
    level: 'advanced',
    key: 'Am',
    created_at: new Date('2024-01-03'),
    updated_at: new Date('2024-01-17'),
  },
];

describe('SongsTableSearch', () => {
  const mockOnSearch = jest.fn();
  const mockOnFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Search functionality', () => {
    it('should render search input', () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      expect(screen.getByPlaceholderText('Search songs...')).toBeInTheDocument();
    });

    it('should debounce search input', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      // Search should not be called immediately
      expect(mockOnSearch).not.toHaveBeenCalled();

      // Fast-forward time to trigger debounced search
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('test');
      });
    });

    it('should clear search when input is cleared', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      
      // Type something
      fireEvent.change(searchInput, { target: { value: 'test' } });
      jest.advanceTimersByTime(300);
      
      // Clear the input
      fireEvent.change(searchInput, { target: { value: '' } });
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('');
      });
    });
  });

  describe('Autocomplete/Suggestions functionality', () => {
    it('should show suggestions when typing in search input', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      await waitFor(() => {
        expect(screen.getByText('Test Song 1')).toBeInTheDocument();
        expect(screen.getByText('Test Song 2')).toBeInTheDocument();
      });
    });

    it('should show multiple suggestions for partial matches', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      fireEvent.change(searchInput, { target: { value: 'song' } });

      await waitFor(() => {
        expect(screen.getByText('Test Song 1')).toBeInTheDocument();
        expect(screen.getByText('Test Song 2')).toBeInTheDocument();
        expect(screen.getByText('Advanced Song')).toBeInTheDocument();
      });
    });

    it('should filter suggestions based on title, author, level, and key', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      
      // Search by author
      fireEvent.change(searchInput, { target: { value: 'author' } });
      await waitFor(() => {
        expect(screen.getByText('Test Author 1')).toBeInTheDocument();
        expect(screen.getByText('Test Author 2')).toBeInTheDocument();
      });

      // Search by level
      fireEvent.change(searchInput, { target: { value: 'beginner' } });
      await waitFor(() => {
        expect(screen.getByText('Test Song 1')).toBeInTheDocument();
      });

      // Search by key
      fireEvent.change(searchInput, { target: { value: 'C' } });
      await waitFor(() => {
        expect(screen.getByText('Test Song 1')).toBeInTheDocument();
      });
    });

    it('should hide suggestions when clicking outside', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      await waitFor(() => {
        expect(screen.getByText('Test Song 1')).toBeInTheDocument();
      });

      // Click outside
      fireEvent.mouseDown(document.body);

      await waitFor(() => {
        expect(screen.queryByText('Test Song 1')).not.toBeInTheDocument();
      });
    });

    it('should select suggestion when clicking on it', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      await waitFor(() => {
        const suggestion = screen.getByText('Test Song 1');
        fireEvent.click(suggestion);
      });

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('Test Song 1');
      });
    });

    it('should navigate suggestions with keyboard arrows', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      fireEvent.change(searchInput, { target: { value: 'test' } });

      await waitFor(() => {
        expect(screen.getByText('Test Song 1')).toBeInTheDocument();
      });

      // Press arrow down
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
      
      // The selected suggestion should be highlighted
      await waitFor(() => {
        const suggestions = screen.getAllByTestId('suggestion-item');
        expect(suggestions[0]).toHaveClass('bg-gray-100');
      });
    });

    it('should show "No suggestions found" when no matches', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      await waitFor(() => {
        expect(screen.getByText('No suggestions found')).toBeInTheDocument();
      });
    });

    it('should limit suggestions to maximum 5 items', async () => {
      const manySongs: Song[] = [
        ...mockSongs,
        {
          id: '4',
          title: 'Song 4',
          author: 'Author 4',
          level: 'beginner',
          key: 'D',
          created_at: new Date('2024-01-04'),
          updated_at: new Date('2024-01-18'),
        },
        {
          id: '5',
          title: 'Song 5',
          author: 'Author 5',
          level: 'intermediate',
          key: 'E',
          created_at: new Date('2024-01-05'),
          updated_at: new Date('2024-01-19'),
        },
        {
          id: '6',
          title: 'Song 6',
          author: 'Author 6',
          level: 'advanced',
          key: 'F',
          created_at: new Date('2024-01-06'),
          updated_at: new Date('2024-01-20'),
        },
      ];

      render(
        <SongsTableSearch
          songs={manySongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      fireEvent.change(searchInput, { target: { value: 'song' } });

      await waitFor(() => {
        const suggestions = screen.getAllByTestId('suggestion-item');
        expect(suggestions).toHaveLength(5); // Should be limited to 5
      });
    });
  });

  describe('Filter functionality', () => {
    it('should render filter controls', () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      expect(screen.getByText('Level:')).toBeInTheDocument();
      expect(screen.getByText('Key:')).toBeInTheDocument();
      expect(screen.getByText('Author:')).toBeInTheDocument();
    });

    it('should apply filters when changed', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const levelSelect = screen.getByLabelText('Filter by level');
      fireEvent.change(levelSelect, { target: { value: 'intermediate' } });

      await waitFor(() => {
        expect(mockOnFilter).toHaveBeenCalledWith({
          level: 'intermediate',
          key: 'All',
          author: 'All',
        });
      });
    });

    it('should combine multiple filters', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const levelSelect = screen.getByLabelText('Filter by level');
      const keySelect = screen.getByLabelText('Filter by key');
      const authorSelect = screen.getByLabelText('Filter by author');

      fireEvent.change(levelSelect, { target: { value: 'intermediate' } });
      fireEvent.change(keySelect, { target: { value: 'G' } });
      fireEvent.change(authorSelect, { target: { value: 'Test Author 2' } });

      await waitFor(() => {
        // Check the last call to mockOnFilter
        const calls = mockOnFilter.mock.calls;
        expect(calls[calls.length - 1][0]).toEqual({
          level: 'intermediate',
          key: 'G',
          author: 'Test Author 2',
        });
      });
    });

    it('should clear all filters when clear button is clicked', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const clearButton = screen.getByText('Clear Filters');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(mockOnFilter).toHaveBeenCalledWith({
          level: 'All',
          key: 'All',
          author: 'All',
        });
      });
    });
  });

  describe('Combined search and filter', () => {
    it('should maintain search term when filters change', async () => {
      render(
        <SongsTableSearch
          songs={mockSongs}
          onSearch={mockOnSearch}
          onFilter={mockOnFilter}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search songs...');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      jest.advanceTimersByTime(300);

      const levelSelect = screen.getByLabelText('Filter by level');
      fireEvent.change(levelSelect, { target: { value: 'intermediate' } });

      await waitFor(() => {
        // Search term should still be in the input
        expect(searchInput).toHaveValue('test');
      });
    });
  });
}); 