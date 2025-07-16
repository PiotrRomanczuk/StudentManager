import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SimplePagination } from '@/app/dashboard/tdd-songs/components/SimplePagination';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

describe('SimplePagination', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  const mockSearchParams = new URLSearchParams('page=1&limit=50&search=test');

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseSearchParams.mockReturnValue(mockSearchParams);
  });

  describe('Rendering', () => {
    it('should render pagination information correctly', () => {
      render(
        <SimplePagination
          currentPage={1}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      expect(screen.getByText('Showing 1-50 of 103 items')).toBeInTheDocument();
    });

    it('should render all page numbers when total pages is small', () => {
      render(
        <SimplePagination
          currentPage={1}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should highlight current page', () => {
      render(
        <SimplePagination
          currentPage={2}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const currentPageButton = screen.getByText('2');
      expect(currentPageButton).toHaveClass('bg-primary');
    });

    it('should not highlight non-current pages', () => {
      render(
        <SimplePagination
          currentPage={2}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const page1Button = screen.getByText('1');
      const page3Button = screen.getByText('3');
      
      expect(page1Button).toHaveClass('border-input');
      expect(page3Button).toHaveClass('border-input');
    });
  });

  describe('Navigation', () => {
    it('should navigate to next page when next button is clicked', () => {
      render(
        <SimplePagination
          currentPage={1}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/tdd-songs?page=2&limit=50&search=test');
    });

    it('should navigate to previous page when previous button is clicked', () => {
      render(
        <SimplePagination
          currentPage={2}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const prevButton = screen.getByLabelText('Previous page');
      fireEvent.click(prevButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/tdd-songs?page=1&limit=50&search=test');
    });

    it('should navigate to specific page when page number is clicked', () => {
      render(
        <SimplePagination
          currentPage={1}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const page3Button = screen.getByText('3');
      fireEvent.click(page3Button);

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/tdd-songs?page=3&limit=50&search=test');
    });

    it('should preserve existing URL parameters when navigating', () => {
      const searchParams = new URLSearchParams('page=1&limit=50&search=test&level=Beginner&key=C');
      mockUseSearchParams.mockReturnValue(searchParams);

      render(
        <SimplePagination
          currentPage={1}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/tdd-songs?page=2&limit=50&search=test&level=Beginner&key=C');
    });
  });

  describe('Button States', () => {
    it('should disable previous button on first page', () => {
      render(
        <SimplePagination
          currentPage={1}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(
        <SimplePagination
          currentPage={3}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
    });

    it('should enable navigation buttons on middle pages', () => {
      render(
        <SimplePagination
          currentPage={2}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Edge Cases', () => {
    it('should not render when totalItems is 0', () => {
      render(
        <SimplePagination
          currentPage={1}
          totalPages={0}
          totalItems={0}
          itemsPerPage={50}
        />
      );

      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.queryByText('Page 1 of 0')).not.toBeInTheDocument();
    });

    it('should not render when totalPages is 1', () => {
      const { container } = render(
        <SimplePagination
          currentPage={1}
          totalPages={1}
          totalItems={50}
          itemsPerPage={50}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle single page correctly', () => {
      render(
        <SimplePagination
          currentPage={1}
          totalPages={1}
          totalItems={50}
          itemsPerPage={50}
        />
      );

      // Should not render anything
      expect(screen.queryByText('Page 1 of 1')).not.toBeInTheDocument();
    });

    it('should handle last page items correctly', () => {
      render(
        <SimplePagination
          currentPage={3}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      expect(screen.getByText('Showing 101-103 of 103 items')).toBeInTheDocument();
    });

    it('should handle empty page correctly', () => {
      render(
        <SimplePagination
          currentPage={2}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      expect(screen.getByText('Showing 51-100 of 103 items')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <SimplePagination
          currentPage={1}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to page 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to page 3')).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(
        <SimplePagination
          currentPage={1}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('URL Parameter Handling', () => {
    it('should handle empty search params', () => {
      const emptySearchParams = new URLSearchParams('');
      mockUseSearchParams.mockReturnValue(emptySearchParams);

      render(
        <SimplePagination
          currentPage={1}
          totalPages={3}
          totalItems={103}
          itemsPerPage={50}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/tdd-songs?page=2');
    });

    it('should handle complex URL parameters', () => {
      const complexSearchParams = new URLSearchParams('page=1&limit=25&search=test&level=Beginner&key=C&author=Test&sortBy=title&sortOrder=asc');
      mockUseSearchParams.mockReturnValue(complexSearchParams);

      render(
        <SimplePagination
          currentPage={1}
          totalPages={3}
          totalItems={103}
          itemsPerPage={25}
        />
      );

      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/tdd-songs?page=2&limit=25&search=test&level=Beginner&key=C&author=Test&sortBy=title&sortOrder=asc');
    });
  });
}); 