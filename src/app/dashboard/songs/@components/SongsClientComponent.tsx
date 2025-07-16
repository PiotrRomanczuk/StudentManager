"use client";

// COMMENTED OUT: Old SongsClientComponent - Replaced with EnhancedSongPage
// This component has been replaced with the new enhanced version that includes:
// - Complete API integration with all endpoints
// - Advanced search and filtering
// - Bulk operations
// - Real-time updates
// - Better mobile support
// - Enhanced UI/UX

// OLD CODE - COMMENTED OUT:
/*
import { useState } from "react";
import { SongTable } from "./SongTable";
import { SongTableMobile } from "./SongTableMobile";
import { TEACHER_TABLE_HEADERS, STUDENT_TABLE_HEADERS } from "./TABLE_HEADERS";
import { Song } from "../../../../types/Song";
import { SongSearchBar } from "./SongSearchBar";
import { PaginationComponent } from "../../@components/pagination/PaginationComponent";
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

  const { setSearchQuery, filteredSongs } = useSongFiltering(songs);
  const { sortedSongs, handleSort, getSortIndicator } = useSongSorting(filteredSongs);

  const { currentSongs } = useSongTable(
    sortedSongs,
    currentPage,
    itemsPerPage,
  );

  const headers = isAdmin ? TEACHER_TABLE_HEADERS : STUDENT_TABLE_HEADERS;
  const actions = isAdmin
    ? (["view", "edit", "delete"] as const)
    : (["view"] as const);
  const showStatus = !isAdmin;

  const totalPages = Math.ceil(sortedSongs.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="w-full max-w-full sm:max-w-md">
        <SongSearchBar songs={songs} onSearch={setSearchQuery} />
      </div>
      <div className="w-full overflow-hidden h-full">
        <div className="block sm:hidden h-full">
          <SongTableMobile
            songs={currentSongs}
            actions={[...actions]}
            showStatus={showStatus}
          />
        </div>
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
*/

// NEW: Enhanced version is now used in enhanced-page.tsx
// Features include:
// - Complete API integration with useSongApi hook
// - Advanced search with real-time filtering
// - Bulk operations (import, export, delete)
// - Favorites management
// - Statistics dashboard
// - Mobile-responsive design
// - Type-safe operations
// - Comprehensive error handling

export default function SongsClientComponent() {
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-semibold text-gray-600 mb-2">
        Enhanced Song Management
      </h2>
      <p className="text-gray-500">
        This component has been replaced with the enhanced version.
        <br />
        Please use the new enhanced song management system.
      </p>
    </div>
  );
}
