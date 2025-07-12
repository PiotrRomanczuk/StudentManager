import { Song } from "@/types/Song";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  ListCollapse,
  User,
  Calendar,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/clients/client";
import React, { useState } from "react";
import { DeleteSongDialog } from "./DeleteSongDialog";

export function SongCardMobile({
  song,
  actions,
  showStatus,
}: {
  song: Song;
  actions: ("edit" | "delete" | "view")[];
  showStatus: boolean;
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    const supabase = await createClient();
    const { error } = await supabase.from("songs").delete().eq("id", song.id);
    if (error) {
      toast.error("Error deleting song: " + error.message);
    } else {
      router.refresh();
      toast.success("Song deleted successfully");
    }
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <>
      <div className="border border-gray-200 rounded-2xl shadow-sm p-5 bg-white mb-4 transition-colors hover:shadow-md" data-testid="song-card-mobile">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
              {song.title.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-base font-bold text-gray-900 truncate max-w-[180px]">
                {song.title}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <User size={14} className="inline-block mr-1 text-gray-400" />
                {song.author}
              </div>
            </div>
          </div>
          <div className="flex flex-nowrap items-center gap-1 ml-2">
            {actions.includes("edit") && (
              <Button
                onClick={() => router.push(`/dashboard/songs/${song.id}/edit`)}
                className="hover:scale-110 transition-transform hover:bg-admin-green-light"
                size="icon"
                aria-label="Edit"
              >
                <Pencil size={16} className="text-admin-green-dark" />
              </Button>
            )}
            {actions.includes("delete") && (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="hover:scale-110 transition-transform hover:bg-admin-gray-light"
                size="icon"
                aria-label="Delete"
              >
                <Trash2 size={16} className="text-admin-gray-dark" />
              </Button>
            )}
            {actions.includes("view") && (
              <Button
                onClick={() => router.push(`/dashboard/songs/${song.id}`)}
                variant="ghost"
                size="icon"
                aria-label="View"
                className="hover:scale-110 transition-transform hover:bg-admin-blue-light"
              >
                <ListCollapse size={16} className="text-admin-blue" />
              </Button>
            )}
          </div>
        </div>
        {showStatus && song.status && (
          <div className="mb-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-songStatus-${song.status}-bg text-songStatus-${song.status}-text shadow-sm`}
            >
              {song.status.replace(/_/g, " ")}
            </span>
          </div>
        )}
        <div className="flex flex-wrap gap-3 items-center text-xs text-gray-700 mt-2">
          <span className="flex items-center gap-1 bg-blue-50 rounded px-2 py-1">
            <Hash size={14} className="text-blue-400" />
            {song.level}
          </span>
          <span className="flex items-center gap-1 bg-purple-50 rounded px-2 py-1">
            <Hash size={14} className="text-purple-400" />
            {song.key}
          </span>
          <span className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
            <Calendar size={14} className="text-gray-400" />
            {formatDate(song.updated_at)}
          </span>
        </div>
      </div>
      <DeleteSongDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        songTitle={song.title}
      />
    </>
  );
}
