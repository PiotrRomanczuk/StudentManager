import { Song } from "@/types/Song";
import { createSong } from "../[song]/edit/actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export async function handleSongCreate(songToCreate: Partial<Song>) {
  try {
    const result = await createSong(songToCreate);

    if (result.success) {
      toast.success(`Song created successfully: ${result.data.title}`);
      redirect("/dashboard/songs");
    }
  } catch (error) {
    console.error("Failed to create song:", error);
    let errorMessage = "Failed to create song";
    
    if (error instanceof Error) {
      if (error.message.includes("songs_shortTitle_key")) {
        errorMessage = "A song with this short title already exists. Please choose a different short title.";
      } else if (error.message.includes("Songs_title_key")) {
        errorMessage = "A song with this title already exists. Please choose a different title.";
      } else {
        errorMessage = error.message;
      }
    }
    
    toast.error(errorMessage);
  }
}

export function handleCancel() {
  redirect("/dashboard/songs");
}
