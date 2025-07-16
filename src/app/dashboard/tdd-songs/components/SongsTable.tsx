import { Song } from '@/types/Song';
import { SongsTableDesktop } from './SongsTableDesktop';
import { SongsTableMobile } from './SongsTableMobile';
import { SongsTablePagination } from './SongsTablePagination';
import { SongsTableSearch, FilterOptions } from './SongsTableSearch';

// Helper function to safely format dates
export const formatDate = (dateValue: Date | string): string => {
  if (dateValue instanceof Date) {
    return dateValue.toLocaleDateString();
  }
  if (typeof dateValue === 'string') {
    return new Date(dateValue).toLocaleDateString();
  }
  return 'Invalid date';
};

export type SortField = 'title' | 'author' | 'level' | 'key' | 'created_at' | 'updated_at';
type SortDirection = 'asc' | 'desc';

interface SongsTableProps {
  songs: Song[];
  onView?: (song: Song) => void;
  hidePagination?: boolean;
}

export function SongsTable({ songs, onView, hidePagination = false }: SongsTableProps) {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const [songsPerPage, setSongsPerPage] = useState(5);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    level: 'All',
    key: 'All',
    author: 'All',
  });

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate dynamic pagination based on window height
  useEffect(() => {
    const calculateSongsPerPage = () => {
      const windowHeight = window.innerHeight;
      const navbarHeight = 64; // Approximate navbar height
      const paginationHeight = 60; // Approximate pagination height
      const buffer = 100; // Extra buffer
      const availableHeight = windowHeight - navbarHeight - paginationHeight - buffer;
      const rowHeight = isMobile ? 200 : 60; // Approximate row height
      const calculatedSongsPerPage = Math.max(1, Math.floor(availableHeight / rowHeight));
      setSongsPerPage(calculatedSongsPerPage);
    };

    calculateSongsPerPage();
    window.addEventListener('resize', calculateSongsPerPage);
    return () => window.removeEventListener('resize', calculateSongsPerPage);
  }, [isMobile]);

  // Filter songs based on search term and filters
  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      // Search term filtering
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        song.title.toLowerCase().includes(searchLower) ||
        song.author.toLowerCase().includes(searchLower) ||
        song.level.toLowerCase().includes(searchLower) ||
        song.key.toLowerCase().includes(searchLower);

      // Filter by level
      const matchesLevel = filters.level === 'All' || song.level === filters.level;

      // Filter by key
      const matchesKey = filters.key === 'All' || song.key === filters.key;

      // Filter by author
      const matchesAuthor = filters.author === 'All' || song.author === filters.author;

      return matchesSearch && matchesLevel && matchesKey && matchesAuthor;
    });
  }, [songs, searchTerm, filters]);

  // Sort filtered songs
  const sortedSongs = useMemo(() => {
    return [...filteredSongs].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Handle date sorting (both Date objects and strings)
      const aDate = aValue instanceof Date ? aValue : new Date(aValue as string);
      const bDate = bValue instanceof Date ? bValue : new Date(bValue as string);
      
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return sortDirection === 'asc' 
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }
      
      return 0;
    });
  }, [filteredSongs, sortField, sortDirection]);

  // Paginate sorted songs
  const paginatedSongs = useMemo(() => {
    const startIndex = (page - 1) * songsPerPage;
    return sortedSongs.slice(startIndex, startIndex + songsPerPage);
  }, [sortedSongs, page, songsPerPage]);

  const totalPages = Math.ceil(sortedSongs.length / songsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page when searching
  };

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  };

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-semibold text-muted-foreground">No songs found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {searchTerm || Object.values(filters).some(f => f !== 'All') 
            ? 'Try adjusting your search or filters'
            : 'No songs are available yet'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SongsTableSearch 
        songs={songs}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
      
      {isMobile ? (
        <SongsTableMobile
          songs={paginatedSongs}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onView={onView}
        />
      ) : (
        <SongsTableDesktop
          songs={paginatedSongs}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onView={onView}
        />
      )}
      
      {!hidePagination && (
        <SongsTablePagination
          key={`pagination-${page}-${totalPages}`}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
} 