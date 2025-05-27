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
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export function SongTable({
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
                {TABLE_HEADERS.filter(h => isAdmin || h.key !== "actions").map((head) => (
                  <TableHead
                    key={`header-${head.key}`}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(head.key as keyof Song)}
                  >
                    <div className="flex items-center gap-2">
                      {head.label}
                      {getSortIndicator(head.key as keyof Song)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSongs.map((song, index) => {
                // Mock status for demonstration
                const status = song.level === "beginner" ? "Active" : song.level === "intermediate" ? "Pending" : "Archived";
                const statusVariant = status === "Active" ? "default" : status === "Pending" ? "secondary" : "outline";
                return (
                  <TableRow
                    key={`${song.id}-${index}`}
                    className="hover:bg-gray-50 transition-colors"
                    aria-label={`Song row for ${song.title}`}
                  >
                    {/* Status */}
                    <TableCell className="px-6 py-4" aria-label="Status">
                      <Badge variant={statusVariant as any} title={status}>{status}</Badge>
                    </TableCell>
                    {/* Title & Author */}
                    <TableCell className="px-6 py-4" aria-label="Title and Author">
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
                          <div className="text-sm text-gray-500">
                            {song.author}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {/* Author (separate column, optional) */}
                    {/* <TableCell className="px-6 py-4" aria-label="Author">
                      <span title={song.author}>{song.author}</span>
                    </TableCell> */}
                    {/* Key */}
                    <TableCell className="px-6 py-4" aria-label="Key">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800" title={song.key}>
                        {song.key}
                      </span>
                    </TableCell>
                    {/* Level */}
                    <TableCell className="px-6 py-4" aria-label="Level">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800" title={song.level}>
                        {song.level}
                      </span>
                    </TableCell>
                    {/* Updated At */}
                    <TableCell className="px-6 py-4 text-sm text-gray-500" aria-label="Updated At">
                      {new Date(song.updated_at || song.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    {/* Actions */}
                    {((isAdmin !== undefined) || (isAdmin === false)) && (
                      <TableCell className="px-6 py-4 flex gap-2" aria-label="Actions">
                        {isAdmin && (
                          <>
                            <Button
                              variant="outline"
                              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                              onClick={() => router.push(`/dashboard/songs/${song.id}/edit`)}
                              aria-label={`Edit ${song.title}`}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                  aria-label={`Delete ${song.title}`}
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Song</DialogTitle>
                                </DialogHeader>
                                <div>Are you sure you want to delete <b>{song.title}</b>?</div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                  </DialogClose>
                                  <Button variant="destructive" onClick={() => {/* TODO: implement delete */}}>
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                        <Button
                          variant="outline"
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                          onClick={() => router.push(`/dashboard/songs/${song.id}`)}
                          aria-label={`View details for ${song.title}`}
                          title="View Details"
                        >
                          View
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
