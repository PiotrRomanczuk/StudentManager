interface PaginationInfoProps {
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  } | null;
}

export function PaginationInfo({ pagination }: PaginationInfoProps) {
  if (!pagination) return null;

  return (
    <div className="mb-4 p-2 bg-gray-100 rounded">
      <p>Total songs: {pagination.total} | Page {pagination.page} of {pagination.totalPages}</p>
    </div>
  );
} 