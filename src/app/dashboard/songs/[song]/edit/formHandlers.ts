import { Song } from "@/types/Song";
import { updateSong } from "./actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export async function handleSongUpdate(
  song: Song,
  songToUpdate: Partial<Song>,
) {
  try {
    const updatedSong = {
      ...song,
      ...songToUpdate,
    };

    const result = await updateSong(updatedSong);

    if (result.success) {
      toast.success(`Song updated successfully: ${updatedSong.title}`);
      redirect(`/dashboard/songs/${song.id}`);
    }
  } catch (error) {
    console.error("Failed to update song:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to update song",
    );
  }
}

export function handleCancel(songId: string) {
  redirect(`/dashboard/songs/${songId}`);
}
