interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  level?: string;
  key?: string;
  author?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface ParsedSearchParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  level?: string;
  key?: string;
  author?: string;
  search?: string;
}

export function parseSearchParams(params: SearchParams): ParsedSearchParams {
  return {
    page: parseInt(params.page || '1'),
    limit: parseInt(params.limit || '50'),
    sortBy: params.sortBy || 'created_at',
    sortOrder: (params.sortOrder || 'desc') as "asc" | "desc",
    level: params.level || undefined,
    key: params.key || undefined,
    author: params.author || undefined,
    search: params.search || undefined,
  };
} 