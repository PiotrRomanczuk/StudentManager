'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function SimplePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: SimplePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Calculate display information
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Update URL with new page
  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/dashboard/tdd-songs?${params.toString()}`);
  };

  // Handle zero items case
  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-center gap-4">
        <div className="text-sm text-muted-foreground">
          <span>No items found</span>
        </div>
      </div>
    );
  }

  // Don't render if no pagination needed
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Page Information */}
      <div className="text-sm text-muted-foreground">
        <span>Page {currentPage} of {totalPages}</span>
        <span className="mx-2">•</span>
        <span>Showing {startItem}-{endItem} of {totalItems} items</span>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => navigateToPage(page)}
              aria-label={`Go to page ${page}`}
              className="min-w-[32px] h-8"
            >
              {page}
            </Button>
          ))}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 