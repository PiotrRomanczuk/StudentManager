import { Button } from '@/components/ui/button';

interface SongsTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SongsTablePagination({ page, totalPages, onPageChange }: SongsTablePaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center gap-2">
      <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>Previous</Button>
      <span className="flex items-center px-3 text-sm">Page {page} of {totalPages}</span>
      <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</Button>
    </div>
  );
} 