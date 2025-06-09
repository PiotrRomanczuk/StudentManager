import { Song } from "@/types/Song";
import { createSong } from "../[song]/edit/actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export async function handleSongCreate(songToCreate: Partial<Song>) {
  try {
    const result = await createSong(songToCreate);

    if (result.success) {
      toast.success(`Song created successfully: ${result.data.title}`);
      redirect("/dashboard/songs/v2");
    }
  } catch (error) {
    console.error("Failed to create song:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to create song",
    );
  }
}

export function handleCancel() {
  redirect("/dashboard/songs/v2");
}
