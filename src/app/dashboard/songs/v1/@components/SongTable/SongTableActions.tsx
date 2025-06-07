import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Info } from "lucide-react";
import { Song } from "@/types/Song";
import React from "react";

interface SongTableActionsProps {
  song: Song;
  isAdmin?: boolean;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

const SongTableActions: React.FC<SongTableActionsProps> = ({
  song,
  isAdmin,
  onEdit,
  onView,
  onDelete,
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      {isAdmin && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            onClick={onEdit}
            aria-label={`Edit ${song.title}`}
            title="Edit"
          >
            <Pencil size={16} />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
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
                  <Button variant="secondary" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  size="sm"
                  className="border-2 hover:bg-gray-300 transition-colors duration-200"
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
      <Button
        variant="outline"
        size="sm"
        className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
        onClick={onView}
        aria-label={`More info about ${song.title}`}
        title="More Info"
      >
        <Info size={16} />
      </Button>
    </>
  );
};

export default SongTableActions;
