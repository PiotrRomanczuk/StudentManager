import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

import { ServerPagination } from '@/app/dashboard/tdd-songs/components/ServerPagination';

const mockPush = jest.fn();
const mockReplace = jest.fn();

const mockRouter = {
  push: mockPush,
  replace: mockReplace,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

const createMockSearchParams = (params: Record<string, string> = {}) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => usp.set(k, v));
  return usp;
};

const mockSearchParams = createMockSearchParams();

describe('ServerPagination', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders pagination controls', () => {
      render(
        <ServerPagination
          currentPage={1}
          totalPages={10}
          totalItems={100}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });

    it('shows correct page information', () => {
      render(
        <ServerPagination
          currentPage={3}
          totalPages={15}
          totalItems={150}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      expect(screen.getByText(/Page 3 of 15/)).toBeInTheDocument();
      expect(screen.getByText(/Showing 21-30 of 150 items/)).toBeInTheDocument();
    });

    it('handles single page correctly', () => {
      const { container } = render(
        <ServerPagination
          currentPage={1}
          totalPages={1}
          totalItems={5}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Navigation Buttons', () => {
    it('renders previous and next buttons', () => {
      render(
        <ServerPagination
          currentPage={2}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });

    it('disables previous button on first page', () => {
      render(
        <ServerPagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();
    });

    it('disables next button on last page', () => {
      render(
        <ServerPagination
          currentPage={5}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
    });

    it('enables both buttons on middle page', () => {
      render(
        <ServerPagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Page Number Navigation', () => {
    it('renders page numbers correctly', () => {
      render(
        <ServerPagination
          currentPage={5}
          totalPages={10}
          totalItems={100}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('shows ellipsis when there are many pages', () => {
      render(
        <ServerPagination
          currentPage={10}
          totalPages={20}
          totalItems={200}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getAllByText('...')).toHaveLength(2);
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('highlights current page', () => {
      render(
        <ServerPagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      const currentPageButton = screen.getByText('3');
      expect(currentPageButton).toHaveClass('bg-primary');
    });
  });

  describe('URL Navigation', () => {
    it('updates URL when navigating to next page', async () => {
      render(
        <ServerPagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/dashboard/tdd-songs'));
      });
    });

    it('updates URL when navigating to previous page', async () => {
      render(
        <ServerPagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      const prevButton = screen.getByLabelText('Previous page');
      fireEvent.click(prevButton);
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/dashboard/tdd-songs'));
      });
    });

    it('updates URL when clicking on page number', async () => {
      render(
        <ServerPagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      const pageButton = screen.getByText('3');
      fireEvent.click(pageButton);
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/dashboard/tdd-songs'));
      });
    });
  });

  describe('Items Per Page', () => {
    it('shows items per page selector when enabled', () => {
      render(
        <ServerPagination
          currentPage={1}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          showItemsPerPage={true}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      expect(screen.getByText('Items per page:')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('resets to page 1 when changing items per page', async () => {
      render(
        <ServerPagination
          currentPage={3}
          totalPages={5}
          totalItems={50}
          itemsPerPage={10}
          showItemsPerPage={true}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      const selectButton = screen.getByRole('combobox');
      fireEvent.click(selectButton);
      const option25 = screen.getByText('25');
      fireEvent.click(option25);
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/\/dashboard\/tdd-songs\?.*limit=25.*page=1/));
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles zero items', () => {
      render(
        <ServerPagination
          currentPage={1}
          totalPages={0}
          totalItems={0}
          itemsPerPage={10}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      expect(screen.getByText(/No items found/)).toBeInTheDocument();
    });

    it('does not render when only one page and no items per page selector', () => {
      const { container } = render(
        <ServerPagination
          currentPage={1}
          totalPages={1}
          totalItems={5}
          itemsPerPage={10}
          showItemsPerPage={false}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders items per page selector even with single page', () => {
      render(
        <ServerPagination
          currentPage={1}
          totalPages={1}
          totalItems={5}
          itemsPerPage={10}
          showItemsPerPage={true}
          router={mockRouter}
          searchParams={mockSearchParams}
        />
      );
      expect(screen.getByText('Items per page:')).toBeInTheDocument();
    });
  });
}); 