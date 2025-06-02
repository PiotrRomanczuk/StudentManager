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
import { TEACHER_TABLE_HEADERS } from "./TEACHER_TABLE_HEADERS";
import { Song } from "@/types/Song";
import React from "react";
import SongTableRow from "../student_table/StudentSongTableRow";
import { createClient } from "@/utils/supabase/clients/client";
import { toast } from "sonner";
import TeacherSongTableRow from "./TeacherSongTableRow";

export function TeacherSongTable({
  songs,
  currentPage,
  itemsPerPage,
  isAdmin,
}: SongsTableProps) {
  const router = useRouter();
  const { currentSongs, handleSort, getSortIndicator } = useSongTable(
    songs,
    currentPage,
    itemsPerPage,
  );

  const handleDelete = async (songId: string) => {
    const supabase = await createClient();
    const { error } = await supabase.from("songs").delete().eq("id", songId);
    if (error) {
      console.error("Error deleting song:", error);
    }
    router.refresh();
    toast.success("Song deleted successfully");
  };

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Songs Library
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                {TEACHER_TABLE_HEADERS.filter((h) => h.key !== "actions").map((head, idx, arr) => {
                  // First column
                  if (idx === 0) {
                    return (
                      <TableHead
                        key={`header-${head.key}`}
                        className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort(head.key as keyof Song)}
                      >
                        <div className="flex items-center gap-1">
                          {head.label}
                          {getSortIndicator(head.key as keyof Song)}
                        </div>
                      </TableHead>
                    );
                  }
                  // Last column (before actions)
                  if (idx === arr.length - 1) {
                    return (
                      <TableHead
                        key={`header-${head.key}`}
                        className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort(head.key as keyof Song)}
                      >
                        <div className="flex items-center gap-1">
                          {head.label}
                          {getSortIndicator(head.key as keyof Song)}
                        </div>
                      </TableHead>
                    );
                  }
                  // Centered columns
                  return (
                    <TableHead
                      key={`header-${head.key}`}
                      className="px-3 py-2 text-center text-[11px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort(head.key as keyof Song)}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {head.label}
                        {getSortIndicator(head.key as keyof Song)}
                      </div>
                    </TableHead>
                  );
                })}
                <TableHead
                  key="header-actions"
                  className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSongs.map((song, index) => (
                <TeacherSongTableRow
                  key={`${song.id}-${index}`}
                  song={song}
                  isAdmin={isAdmin}
                  onEdit={() => router.push(`/dashboard/songs/${song.id}/edit`)}
                  onView={() => router.push(`/dashboard/songs/${song.id}`)}
                  onDelete={() => handleDelete(song.id)}
                  hideStatus={true}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 