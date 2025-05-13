"use client";

import { useState } from "react";
import { SongTable } from "./SongTable";
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
    <div className="space-y-4">
      <SongSearchBar songs={songs} onSearch={setSearchQuery} />
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
