"use client";

import { useState } from "react";
import { SongTable } from "./SongTable";
import { PaginationComponent } from "./PaginationComponent";
import { Song } from "@/types/Song";

export default function SongsClientComponent({ songs }: { songs: Song[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(songs.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <SongTable
        songs={songs}
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
    </>
  );
}