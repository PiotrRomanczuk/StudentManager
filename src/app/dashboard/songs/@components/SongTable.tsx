"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SongsTableProps } from "./types/tableTypes";
import { useSongTable } from "./hooks/useSongTable";
import { TABLE_HEADERS } from "./constants/tableConstants";
import { Song } from "@/types/Song";

export function SongTable({
  songs,
  currentPage,
  itemsPerPage,
}: SongsTableProps) {
  const router = useRouter();
  const { currentSongs, handleSort, getSortIndicator } = useSongTable(
    songs,
    currentPage,
    itemsPerPage,
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Songs Library
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                {TABLE_HEADERS.map((head) => (
                  <TableHead
                    key={`header-${head}`}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(head as keyof Song)}
                  >
                    <div className="flex items-center gap-2">
                      {head}
                      {getSortIndicator(head as keyof Song)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSongs.map((song, index) => (
                <TableRow
                  key={`${song.id}-${index}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {song.title.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {song.title}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {song.level}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {song.key}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500">
                    {new Date(song.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                      onClick={() => router.push(`/dashboard/songs/${song.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
