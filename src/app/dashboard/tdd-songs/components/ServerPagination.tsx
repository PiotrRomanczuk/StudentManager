'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ServerPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  showItemsPerPage?: boolean;
  className?: string;
}

export function ServerPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  showItemsPerPage = false,
  className = '',
}: ServerPaginationProps) {
  // Always use hooks from next/navigation
  const router = useRouter();
  const searchParams = useSearchParams();

  // Calculate display information
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, current page, and pages around current
      pages.push(1);

      if (currentPage > 4) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Update URL with new page
  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/dashboard/tdd-songs?${params.toString()}`);
  };

  // Update URL with new items per page
  const handleItemsPerPageChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit);
    params.set('page', '1'); // Reset to first page
    router.push(`/dashboard/tdd-songs?${params.toString()}`);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  // Handle zero items case
  if (totalItems === 0) {
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <div className="text-sm text-muted-foreground">
          <span>No items found</span>
        </div>
      </div>
    );
  }

  // Don't render if no pagination needed and no items per page selector
  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Page Information */}
      <div className="text-sm text-muted-foreground">
        <span className="hidden sm:inline">
          Page {currentPage} of {totalPages}
        </span>
        <span className="sm:mx-2">•</span>
        <span>
          Showing {startItem}-{endItem} of {totalItems} items
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Items per page selector */}
        {showItemsPerPage && (
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-muted-foreground">
              Items per page:
            </label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger id="items-per-page" className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            onKeyDown={(e) => handleKeyDown(e, () => navigateToPage(currentPage - 1))}
            tabIndex={0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === '...'
                  ? <span className="px-2 py-1 text-muted-foreground">...</span>
                  : <Button
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => navigateToPage(page as number)}
                      aria-label={`Go to page ${page}`}
                      onKeyDown={(e) => handleKeyDown(e, () => navigateToPage(page as number))}
                      tabIndex={0}
                      className="min-w-[32px] h-8"
                    >
                      {page}
                    </Button>
                }
              </div>
            ))}
          </div>

          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            onKeyDown={(e) => handleKeyDown(e, () => navigateToPage(currentPage + 1))}
            tabIndex={0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
