import { useState, useEffect, useMemo, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Song } from '@/types/Song';

export interface FilterOptions {
  level: string;
  key: string;
  author: string;
}

interface SongsTableSearchProps {
  songs: Song[];
  onSearch: (searchTerm: string) => void;
  onFilter: (filters: FilterOptions) => void;
}

export function SongsTableSearch({ songs, onSearch, onFilter }: SongsTableSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    level: 'All',
    key: 'All',
    author: 'All',
  });
  const [isMobile, setIsMobile] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle window resize for responsive design
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const levels = [...new Set(songs.map(song => song.level))];
    const keys = [...new Set(songs.map(song => song.key))];
    const authors = [...new Set(songs.map(song => song.author))];

    return {
      levels: ['All', ...levels],
      keys: ['All', ...keys],
      authors: ['All', ...authors],
    };
  }, [songs]);

  // Generate suggestions based on search term
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const searchLower = searchTerm.toLowerCase();
    const matches = songs.filter(song => 
      song.title.toLowerCase().includes(searchLower) ||
      song.author.toLowerCase().includes(searchLower) ||
      song.level.toLowerCase().includes(searchLower) ||
      song.key.toLowerCase().includes(searchLower)
    );
    
    // Limit to 5 suggestions
    return matches.slice(0, 5);
  }, [songs, searchTerm]);

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      level: 'All',
      key: 'All',
      author: 'All',
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.trim().length > 0);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: Song) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(suggestion.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        {/* Search input with suggestions */}
        <div className="relative" ref={searchRef}>
          <Input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
            aria-label="Search songs"
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    data-testid="suggestion-item"
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      index === selectedIndex ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium">{suggestion.title}</div>
                    <div className="text-sm text-gray-600">
                      {suggestion.author} • {suggestion.level} • {suggestion.key}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No suggestions found</div>
              )}
            </div>
          )}
        </div>

        {/* Mobile filter dropdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Filters</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Level:</label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full text-sm border rounded px-2 py-1 mt-1"
                aria-label="Filter by level"
              >
                {filterOptions.levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Key:</label>
              <select
                value={filters.key}
                onChange={(e) => handleFilterChange('key', e.target.value)}
                className="w-full text-sm border rounded px-2 py-1 mt-1"
                aria-label="Filter by key"
              >
                {filterOptions.keys.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Author:</label>
              <select
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="w-full text-sm border rounded px-2 py-1 mt-1"
                aria-label="Filter by author"
              >
                {filterOptions.authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="space-y-4 p-4">
      {/* Search input with suggestions */}
      <div className="relative" ref={searchRef}>
        <Input
          type="text"
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full"
          aria-label="Search songs"
        />
        
        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  data-testid="suggestion-item"
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    index === selectedIndex ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-medium">{suggestion.title}</div>
                  <div className="text-sm text-gray-600">
                    {suggestion.author} • {suggestion.level} • {suggestion.key}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No suggestions found</div>
            )}
          </div>
        )}
      </div>

      {/* Desktop filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Level:</span>
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="text-sm border rounded px-2 py-1"
            aria-label="Filter by level"
          >
            {filterOptions.levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Key:</span>
          <select
            value={filters.key}
            onChange={(e) => handleFilterChange('key', e.target.value)}
            className="text-sm border rounded px-2 py-1"
            aria-label="Filter by key"
          >
            {filterOptions.keys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Author:</span>
          <select
            value={filters.author}
            onChange={(e) => handleFilterChange('author', e.target.value)}
            className="text-sm border rounded px-2 py-1"
            aria-label="Filter by author"
          >
            {filterOptions.authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="text-xs"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
} 