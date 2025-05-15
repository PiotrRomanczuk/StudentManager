"use client";

import { useState } from "react";
import { SongTable } from "./SongTable";
import { SongTableMobile } from "./SongTableMobile";
import { PaginationComponent } from "./PaginationComponent";
import { SongSearchBar } from "./SongSearchBar";
import { Song } from "@/types/Song";

export default function SongsClientComponent({ songs }: { songs: Song[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 24;

  // Sort songs by updated_at for the table
  const timeSortedSongs = [...songs].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  const filteredSongs = timeSortedSongs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="w-full max-w-full sm:max-w-md">
        <SongSearchBar songs={songs} onSearch={setSearchQuery} />
      </div>
      <div className="w-full overflow-hidden">
        {/* Mobile view */}
        <div className="block sm:hidden">
          <SongTableMobile
            songs={filteredSongs}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
        {/* Desktop view */}
        <div className="hidden sm:block">
          <SongTable
            songs={filteredSongs}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {totalPages > 1 && (
        <div className="w-full flex justify-center">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
