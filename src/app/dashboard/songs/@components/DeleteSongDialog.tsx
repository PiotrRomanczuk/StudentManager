import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteSongDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  songTitle: string;
}

export function DeleteSongDialog({
  isOpen,
  onClose,
  onConfirm,
  songTitle,
}: DeleteSongDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="inset-0 flex items-center justify-center" data-testid="delete-song-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this song?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete &quot;{songTitle}&quot;. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-300 hover:bg-gray-400">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            autoFocus
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
