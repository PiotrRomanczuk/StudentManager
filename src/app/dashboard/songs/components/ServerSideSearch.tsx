'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface Song {
  level?: string;
  key?: string;
  author?: string;
}

interface ServerSideSearchProps {
  songs: Song[]; // For getting unique values for filters
}

export function ServerSideSearch({ songs }: ServerSideSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [key, setKey] = useState(searchParams.get('key') || 'All');
  const [author, setAuthor] = useState(searchParams.get('author') || 'All');

  // Get unique values for filters
  const uniqueLevels = ['All', ...Array.from(new Set(songs.map(song => song.level).filter(Boolean) as string[]))];
  const uniqueKeys = ['All', ...Array.from(new Set(songs.map(song => song.key).filter(Boolean) as string[]))];
  const uniqueAuthors = ['All', ...Array.from(new Set(songs.map(song => song.author).filter(Boolean) as string[]))];

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
  const hasActiveFilters = searchTerm || level !== 'All' || key !== 'All' || author !== 'All';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
        </div>
        
        <Select value={level} onValueChange={handleLevelChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {uniqueLevels.map((lvl) => (
              <SelectItem key={lvl} value={lvl}>
                {lvl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={key} onValueChange={handleKeyChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Key" />
          </SelectTrigger>
          <SelectContent>
            {uniqueKeys.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={author} onValueChange={handleAuthorChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Author" />
          </SelectTrigger>
          <SelectContent>
            {uniqueAuthors.map((auth) => (
              <SelectItem key={auth} value={auth}>
                {auth}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 