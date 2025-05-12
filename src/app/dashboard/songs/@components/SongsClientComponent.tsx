"use client";

import { useState, useEffect, useRef } from "react";
import { SongTable } from "./SongTable";
import { PaginationComponent } from "./PaginationComponent";
import { Song } from "@/types/Song";

export default function SongsClientComponent({ songs }: { songs: Song[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 24;

  // Sort songs alphabetically for the dropdown
  const alphabeticallySortedSongs = [...songs].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  // Sort songs by updated_at for the table
  const timeSortedSongs = [...songs].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  const filteredSongs = timeSortedSongs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSongSelect = (songTitle: string) => {
    setSearchQuery(songTitle);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="w-full max-w-md relative" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {alphabeticallySortedSongs.map((song) => (
              <div
                key={song.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSongSelect(song.title)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{song.title}</span>
                  <span className="text-sm text-gray-500">{song.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SongTable
        songs={filteredSongs}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
