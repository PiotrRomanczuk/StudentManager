import { ServerPagination } from './ServerPagination';

interface PaginationWrapperProps {
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  } | null;
}

export function PaginationWrapper({ pagination }: PaginationWrapperProps) {
  if (!pagination) return null;

  return (
    <div className="mt-6">
      <ServerPagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
        showItemsPerPage={true}
      />
    </div>
  );
} 