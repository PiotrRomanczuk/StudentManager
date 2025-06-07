"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SongsTableProps } from "../../types/tableTypes";
import { useSongTable } from "../../hooks/useSongTable";
import { STUDENT_TABLE_HEADERS } from "./STUDENT_TABLE_HEADERS";
import { Song } from "@/types/Song";
import React from "react";
import SongTableRow from "./StudentSongTableRow";

export function StudentSongTable({
  songs,
  currentPage,
  itemsPerPage,
}: Omit<SongsTableProps, "isAdmin">) {
  const router = useRouter();
  const { currentSongs, handleSort, getSortIndicator } = useSongTable(
    songs,
    currentPage,
    itemsPerPage,
  );

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Songs Library
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                {STUDENT_TABLE_HEADERS.filter(
                  (h: { key: string }) => h.key !== "actions",
                ).map((head: { key: string; label: string }) => (
                  <TableHead
                    key={`header-${head.key}`}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors${head.key === "status" ? " w-12" : ""}`}
                    onClick={() => handleSort(head.key as keyof Song)}
                  >
                    <div className="flex items-center gap-2">
                      {head.label}
                      {getSortIndicator(head.key as keyof Song)}
                    </div>
                  </TableHead>
                ))}
                <TableHead
                  key="header-actions"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSongs.map((song, index) => (
                <SongTableRow
                  key={`${song.id}-${index}`}
                  song={song}
                  isAdmin={false}
                  onEdit={() => {}}
                  onView={() => router.push(`/dashboard/songs/${song.id}`)}
                  onDelete={() => {}}
                  hideStatus={false}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
