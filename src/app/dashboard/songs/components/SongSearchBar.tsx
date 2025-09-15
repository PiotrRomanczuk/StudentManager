"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Song } from '@/types/Song';

interface SongSearchBarProps {
  songs: Song[];
  onSearch: (query: string) => void;
}

export function SongSearchBar({ songs, onSearch }: SongSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Song[]>([]);

  // Generate suggestions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const matches = songs.filter(song => 
      song.title.toLowerCase().includes(searchLower) ||
      song.author.toLowerCase().includes(searchLower)
    );
    
    setSuggestions(matches.slice(0, 5));
    setShowSuggestions(matches.length > 0);
  }, [searchTerm, songs]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSuggestionClick = (song: Song) => {
    setSearchTerm(song.title);
    setShowSuggestions(false);
    onSearch(song.title);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for a song..."
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="w-full"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((song) => (
            <button
              key={song.id}
              type="button"
              onClick={() => handleSuggestionClick(song)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="font-medium">{song.title}</div>
              <div className="text-sm text-gray-500">{song.author}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 