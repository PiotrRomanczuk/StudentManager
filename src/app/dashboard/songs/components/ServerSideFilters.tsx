"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { FilterControls } from './FilterControls';

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

export function ServerSideFilters({ songs, filterOptions }: ServerSideFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [key, setKey] = useState(searchParams.get('key') || 'All');
  const [author, setAuthor] = useState(searchParams.get('author') || 'All');

  // Get unique values for filters - use filterOptions if available, otherwise fall back to current songs
  const uniqueLevels = filterOptions 
    ? ['All', ...filterOptions.levels]
    : ['All', ...Array.from(new Set(songs.map((song: Song) => song.level).filter(Boolean) as string[]))];
  
  const uniqueKeys = filterOptions 
    ? ['All', ...filterOptions.keys]
    : ['All', ...Array.from(new Set(songs.map((song: Song) => song.key).filter(Boolean) as string[]))];
  
  const uniqueAuthors = filterOptions 
    ? ['All', ...filterOptions.authors]
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
  const handleLevelChange = (value: string) => {
    setLevel(value);
    updateURL({ level: value });
  };

  const handleKeyChange = (value: string) => {
    setKey(value);
    updateURL({ key: value });
  };

  const handleAuthorChange = (value: string) => {
    setAuthor(value);
    updateURL({ author: value });
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

  return (
    <div className="space-y-4 mb-6">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />
      <FilterControls
        level={level}
        key={key}
        author={author}
        uniqueLevels={uniqueLevels}
        uniqueKeys={uniqueKeys}
        uniqueAuthors={uniqueAuthors}
        onLevelChange={handleLevelChange}
        onKeyChange={handleKeyChange}
        onAuthorChange={handleAuthorChange}
      />
    </div>
  );
} 