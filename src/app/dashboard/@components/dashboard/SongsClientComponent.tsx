"use client";

import { useState } from "react";
import { PaginationComponent } from "../pagination/PaginationComponent";
import { SongSearchBar } from "@/components/dashboard/SongSearchBar";
import { Song } from "@/types/Song";
import { TeacherSongTable } from "../../songs/v1/@components/SongTable/admin_table/TeacherSongTable";
import { TeacherSongTableMobile } from "../../songs/v1/@components/SongTable/admin_table/TeacherSongTableMobile";
import { StudentSongTable } from "../../songs/v1/@components/SongTable/student_table/StudentSongTable";
import { StudentSongTableMobile } from "../../songs/v1/@components/SongTable/student_table/StudentSongTableMobile";

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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="w-full max-w-full sm:max-w-md">
        <SongSearchBar songs={songs} onSearch={setSearchQuery} />
      </div>
      <div className="w-full overflow-hidden h-full">
        {/* Mobile view */}
        <div className="block sm:hidden h-full">
          {isAdmin ? (
            <TeacherSongTableMobile
              songs={filteredSongs}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          ) : (
            <StudentSongTableMobile
              songs={filteredSongs}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        {/* Desktop view */}
        <div className="hidden sm:block h-full">
          {isAdmin ? (
            <TeacherSongTable
              songs={filteredSongs}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              isAdmin={isAdmin}
            />
          ) : (
            <StudentSongTable
              songs={filteredSongs}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
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
