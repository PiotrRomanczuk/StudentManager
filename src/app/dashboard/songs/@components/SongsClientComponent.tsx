"use client";

import { useMemo, useState } from "react";
import { SongTable } from "./SongTable";
import { SongTableMobile } from "./SongTableMobile";
import { TEACHER_TABLE_HEADERS, STUDENT_TABLE_HEADERS } from "./TABLE_HEADERS";
import { Song } from "@/types/Song";
import { SongSearchBar } from "./SongSearchBar";
import { PaginationComponent } from "@/app/dashboard/components/pagination/PaginationComponent";
import { useSongSorting } from "./hooks/useSongSorting";
import { useSongFiltering } from "./hooks/useSongFiltering";
import { useSongTable } from "./hooks/useSongTable";

interface SongsClientComponentProps {
  songs: Song[];
  isAdmin?: boolean;
}

export default function SongsClientComponent({
  songs,
  isAdmin,
}: SongsClientComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const { sortConfig, handleSort, getSortIndicator } = useSongSorting();
  const { setSearchQuery, filteredSongs } = useSongFiltering(songs);

  // Apply sorting to filtered songs
  const sortedAndFilteredSongs = useMemo(() => {
    if (!sortConfig.key) return filteredSongs;

    return [...filteredSongs].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Song];
      const bValue = b[sortConfig.key as keyof Song];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [filteredSongs, sortConfig]);

  const { currentSongs } = useSongTable(
    sortedAndFilteredSongs,
    currentPage,
    itemsPerPage,
  );

  const headers = isAdmin ? TEACHER_TABLE_HEADERS : STUDENT_TABLE_HEADERS;
  const actions = isAdmin
    ? (["view", "edit", "delete"] as const)
    : (["view"] as const);
  const showStatus = !isAdmin;

  const totalPages = Math.ceil(sortedAndFilteredSongs.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="w-full max-w-full sm:max-w-md">
        <SongSearchBar songs={songs} onSearch={setSearchQuery} />
      </div>
      <div className="w-full overflow-hidden h-full">
        {/* Mobile view */}
        <div className="block sm:hidden h-full">
          <SongTableMobile
            songs={currentSongs}
            actions={[...actions]}
            showStatus={showStatus}
          />
        </div>
        {/* Desktop view */}
        <div className="hidden sm:block h-full">
          <SongTable
            songs={currentSongs}
            headers={headers}
            actions={[...actions]}
            showStatus={showStatus}
            onSort={handleSort}
            getSortIndicator={getSortIndicator}
          />
        </div>
      </div>
      {totalPages > 1 && (
        <div className="w-full flex justify-center mt-4">
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
