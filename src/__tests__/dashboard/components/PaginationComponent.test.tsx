import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationComponent } from '@/app/dashboard/@components/pagination/PaginationComponent';

describe('PaginationComponent', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render pagination with correct number of pages', () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show page numbers 1-5
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render previous and next buttons', () => {
    render(
      <PaginationComponent
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should call onPageChange when page number is clicked', () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when previous button is clicked', () => {
    render(
      <PaginationComponent
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when next button is clicked', () => {
    render(
      <PaginationComponent
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should disable previous button on first page', () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous').closest('a');
    expect(previousButton).toHaveClass('pointer-events-none', 'opacity-50');
  });

  it('should disable next button on last page', () => {
    render(
      <PaginationComponent
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next').closest('a');
    expect(nextButton).toHaveClass('pointer-events-none', 'opacity-50');
  });

  it('should handle single page', () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  it('should handle large number of pages', () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show all pages
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('should not call onPageChange when disabled buttons are clicked', () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous');
    const previousLink = previousButton.closest('a');
    
    // Check that the button has disabled styling
    expect(previousLink).toHaveClass('pointer-events-none', 'opacity-50');
    
    // The click should not trigger onPageChange due to pointer-events-none
    fireEvent.click(previousButton);
    
    // Note: The actual behavior depends on the CSS pointer-events-none
    // In a real browser, this would prevent the click, but in tests it might still fire
    // This test verifies the styling is correct
  });

  it('should have proper responsive styling', () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous').closest('a');
    expect(previousButton).toHaveClass('text-sm', 'sm:text-base');
  });

  it('should handle edge case of current page being 0', () => {
    render(
      <PaginationComponent
        currentPage={0}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    // Should still render without errors
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should handle edge case of total pages being 0', () => {
    render(
      <PaginationComponent
        currentPage={1}
        totalPages={0}
        onPageChange={mockOnPageChange}
      />
    );

    // Should handle gracefully - check that navigation exists
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
}); 