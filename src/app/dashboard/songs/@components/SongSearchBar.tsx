"use client";

import { useState, useEffect, useRef } from "react";
import { Song } from "../../../../types/Song";

interface SongSearchBarProps {
  songs: Song[];
  onSearch: (query: string) => void;
}

export function SongSearchBar({ songs, onSearch }: SongSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const alphabeticallySortedSongs = [...songs].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const filteredSongs = searchQuery.trim()
    ? alphabeticallySortedSongs.filter((song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : alphabeticallySortedSongs;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsDropdownOpen(false);
          setIsAnimating(false);
        }, 200); // match transition duration
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
    setIsAnimating(true);
    setTimeout(() => {
      setIsDropdownOpen(false);
      setIsAnimating(false);
    }, 200);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFocus = () => {
    setIsDropdownOpen(true);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search songs..."
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {(isDropdownOpen || isAnimating) && (
        <div
          className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-y-auto transition-all duration-200 ease-in-out
            ${isDropdownOpen ? "max-h-[300px] opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-95"}
            origin-top
          `}
        >
          <div
            className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
            onClick={() => handleSongSelect("")}
          >
            <div className="flex flex-col">
              <span className="font-medium text-sm sm:text-base truncate">
                None
              </span>
              <span className="text-xs sm:text-sm text-gray-500 truncate">
                Show all songs
              </span>
            </div>
          </div>
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSongSelect(song.title)}
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm sm:text-base truncate">
                  {song.title}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 truncate">
                  {song.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
