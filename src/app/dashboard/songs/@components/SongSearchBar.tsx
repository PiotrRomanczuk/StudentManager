"use client";

import { useState, useEffect, useRef } from "react";
import { Song } from "@/types/Song";

interface SongSearchBarProps {
  songs: Song[];
  onSearch: (query: string) => void;
}

export function SongSearchBar({ songs, onSearch }: SongSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sort songs alphabetically for the dropdown
  const alphabeticallySortedSongs = [...songs].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSongSelect = (songTitle: string) => {
    setSearchQuery(songTitle);
    onSearch(songTitle);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search songs..."
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setIsDropdownOpen(true)}
        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
          {alphabeticallySortedSongs.map((song) => (
            <div
              key={song.id}
              className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSongSelect(song.title)}
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm sm:text-base truncate">{song.title}</span>
                <span className="text-xs sm:text-sm text-gray-500 truncate">{song.author}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 