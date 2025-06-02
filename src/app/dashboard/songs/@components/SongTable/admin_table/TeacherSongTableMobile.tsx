"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SongsTableProps } from "../../types/tableTypes";
import { useSongTable } from "../../hooks/useSongTable";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/clients/client";
import React from "react";
import { toast } from "sonner";

export function TeacherSongTableMobile({
  songs,
  currentPage,
  itemsPerPage,
}: Omit<SongsTableProps, 'isAdmin'>) {
  const router = useRouter();
  const { currentSongs } = useSongTable(songs, currentPage, itemsPerPage);

  const handleDelete = async (songId: string) => {
    const supabase = await createClient();
    const { error } = await supabase.from("songs").delete().eq("id", songId);
    if (error) {
      toast.error("Error deleting song: " + error.message);
    } else {
      router.refresh();
      toast.success("Song deleted successfully");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Songs Library
        </h3>
        <div className="space-y-3">
          {currentSongs.map((song, index) => (
            <div
              key={`${song.id}-${index}`}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {song.title.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {song.title}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
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
                        size="icon"
                        className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                        aria-label={`Delete ${song.title}`}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Delete Song</DialogTitle>
                      </DialogHeader>
                      <div>
                        Are you sure you want to delete <b>{song.title}</b>?
                      </div>
                      <DialogFooter>
                        <DialogClose
                          asChild
                          className="border-2 hover:bg-gray-300 transition-colors duration-200"
                        >
                          <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(song.id)}
                          className="border-2 hover:bg-gray-300 transition-colors duration-200"
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                    onClick={() => router.push(`/dashboard/songs/${song.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {song.level}
                </span>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                  {song.key}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(song.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 