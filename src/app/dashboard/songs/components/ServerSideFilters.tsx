"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { EnhancedSearch } from '@/components/ui/enhanced-search';
import { EnhancedFilters } from '@/components/ui/enhanced-filters';
import { Music, User, Calendar } from 'lucide-react';

interface Song {
  level?: string;
  key?: string;
  author?: string;
}

interface ServerSideFiltersProps {
  songs: Song[]; // For getting unique values for filters
  filterOptions?: {
    levels: string[];
    keys: string[];
    authors: string[];
  };
}

export function ServerSideFilters({ songs, filterOptions: propFilterOptions }: ServerSideFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [key, setKey] = useState(searchParams.get('key') || 'All');
  const [author, setAuthor] = useState(searchParams.get('author') || 'All');

  // Get unique values for filters - use filterOptions if available, otherwise fall back to current songs
  const uniqueLevels = propFilterOptions 
    ? ['All', ...propFilterOptions.levels]
    : ['All', ...Array.from(new Set(songs.map((song: Song) => song.level).filter(Boolean) as string[]))];
  
  const uniqueKeys = propFilterOptions 
    ? ['All', ...propFilterOptions.keys]
    : ['All', ...Array.from(new Set(songs.map((song: Song) => song.key).filter(Boolean) as string[]))];
  
  const uniqueAuthors = propFilterOptions 
    ? ['All', ...propFilterOptions.authors]
    : ['All', ...Array.from(new Set(songs.map((song: Song) => song.author).filter(Boolean) as string[]))];

  // Update URL with new parameters
  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    // Update parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'All') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`/dashboard/songs?${params.toString()}`);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateURL({ search: value });
  };

  // Handle filter changes
  const handleFilterChange = (filterKey: string, value: string) => {
    switch (filterKey) {
      case 'level':
        setLevel(value);
        updateURL({ level: value });
        break;
      case 'key':
        setKey(value);
        updateURL({ key: value });
        break;
      case 'author':
        setAuthor(value);
        updateURL({ author: value });
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setLevel('All');
    setKey('All');
    setAuthor('All');
    updateURL({ search: '', level: '', key: '', author: '' });
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(searchTerm || level !== 'All' || key !== 'All' || author !== 'All');

  // Prepare filter options for enhanced filters component
  const enhancedFilterOptions = {
    level: uniqueLevels.map(level => ({
      value: level,
      label: level,
      icon: <Music className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    })),
    key: uniqueKeys.map(key => ({
      value: key,
      label: key,
      icon: <Calendar className="h-4 w-4" />,
      color: 'bg-orange-100 text-orange-700 border-orange-200'
    })),
    author: uniqueAuthors.map(author => ({
      value: author,
      label: author,
      icon: <User className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    }))
  };

  const currentFilters = {
    level,
    key,
    author
  };

  return (
    <div className="space-y-4 mb-6">
      <EnhancedSearch
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        placeholder="Search songs by title, author, or key..."
      />
      
      <EnhancedFilters
        filters={currentFilters}
        filterOptions={enhancedFilterOptions}
        onFilterChange={handleFilterChange}
        onClearAll={clearFilters}
      />
    </div>
  );
} 