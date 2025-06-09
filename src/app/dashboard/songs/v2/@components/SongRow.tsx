import { TableRow, TableCell } from "@/components/ui/table";
import { Song } from "@/types/Song";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ListCollapse } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/clients/client";
import React, { useState } from "react";
import { DeleteSongDialog } from "./DeleteSongDialog";

export function SongRow({
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
      <TableRow>
        <TableCell className="w-full max-w-0 truncate">{song.title}</TableCell>
        {showStatus && <TableCell>{song.status}</TableCell>}
        <TableCell>{song.level}</TableCell>
        <TableCell>{song.key}</TableCell>
        <TableCell>{formatDate(song.updated_at)}</TableCell>
        <TableCell className="text-right sticky right-0 min-w-fit w-auto">
          <div className="flex flex-nowrap justify-end items-center gap-1">
            {actions.includes("view") && (
              <Button
                onClick={() => router.push(`/dashboard/songs/v2/${song.id}`)}
                variant="ghost"
                size="icon"
                aria-label="View"
                className="hover:scale-110 transition-transform hover:bg-admin-blue-light"
              >
                <ListCollapse size={16} className="text-admin-blue" />
              </Button>
            )}
            {actions.includes("edit") && (
              <Button
                onClick={() =>
                  router.push(`/dashboard/songs/v2/${song.id}/edit`)
                }
                className="hover:scale-110 transition-transform hover:bg-admin-green-light"
              >
                <Pencil size={16} className="text-admin-green-dark" />
              </Button>
            )}
            {actions.includes("delete") && (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="hover:scale-110 transition-transform hover:bg-admin-gray-light"
              >
                <Trash2 size={16} className="text-admin-gray-dark" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      <DeleteSongDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        songTitle={song.title}
      />
    </>
  );
}
