"use client";

import { useState } from "react";
import { PaginationComponent } from "../pagination/PaginationComponent";
import { SongSearchBar } from "@/components/dashboard/SongSearchBar";
import { Song } from "@/types/Song";
import { SongTable } from "../../songs/@components/SongTable";
import { SongTableMobile } from "../../songs/@components/SongTableMobile";

interface SongsClientComponentProps {
  songs: Song[];
  isAdmin?: boolean;
}

export default function SongsClientComponent({
  songs,
  isAdmin,
}: SongsClientComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = songs.length < 15 ? songs.length || 1 : 15;

  const filteredSongs = songs
    .filter((song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

  const headers = [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "level", label: "Level" },
    { key: "updated_at", label: "Last Updated" },
  ];
  const actions: ("view" | "edit" | "delete")[] = isAdmin ? ["view", "edit", "delete"] : ["view"];
  const showStatus = true;
  const [sortKey, setSortKey] = useState<keyof Song>("updated_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const onSort = (key: keyof Song) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const getSortIndicator = (key: keyof Song) => {
    if (sortKey !== key) return "";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const sortedSongs = [...filteredSongs].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue === undefined || bValue === undefined) return 0;
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortOrder === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    return 0;
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="w-full max-w-full sm:max-w-md">
        <SongSearchBar songs={songs} onSearch={setSearchQuery} />
      </div>
      <div className="w-full overflow-hidden h-full">
        {/* Mobile view */}
        <div className="block sm:hidden h-full">
          <SongTableMobile
            songs={sortedSongs}
            actions={actions}
            showStatus={showStatus}
          />
        </div>
        {/* Desktop view */}
        <div className="hidden sm:block h-full">
          <SongTable
            songs={sortedSongs}
            headers={headers}
            actions={actions}
            showStatus={showStatus}
            onSort={onSort}
            getSortIndicator={getSortIndicator}
          />
        </div>
      </div>
      {totalPages > 1 && (
        <div className="w-full flex justify-center">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
