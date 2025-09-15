'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { EnhancedPagination } from '@/components/ui/enhanced-pagination';

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // Update URL with new page
  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/dashboard/songs?${params.toString()}`);
  };

  // Update URL with new items per page
  const handleItemsPerPageChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit.toString());
    params.set('page', '1'); // Reset to first page
    router.push(`/dashboard/songs?${params.toString()}`);
  };

  return (
    <EnhancedPagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      showItemsPerPage={showItemsPerPage}
      onPageChange={navigateToPage}
      onItemsPerPageChange={handleItemsPerPageChange}
      className={className}
    />
  );
}
