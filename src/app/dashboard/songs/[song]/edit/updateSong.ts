import { Song } from "@/types/Song";
import { createClient } from "@/utils/supabase/clients/client";

export async function updateSong(song: Song) {
  const supabase = createClient(); // No need for `await` if it doesn't return a promise

  console.log("Attempting to update song with ID:", song.id);
  console.log("New song data:", song);

  // Fetch the existing record for comparison
  const { data: existingData, error: fetchError } = await supabase
    .from("songs")
    .select()
    .eq("id", song.id)
    .single();

  if (fetchError) {
    console.error("Error fetching existing song:", fetchError);
    throw new Error(`Error fetching existing song: ${fetchError.message}`);
  }

  if (!existingData) {
    console.warn("No existing song found with the given ID:", song.id);
    throw new Error(`No song found with ID: ${song.id}`);
  }

  console.log("Existing song data:", existingData);

  // Check if there are any changes to be made
  const isDataIdentical = JSON.stringify(existingData) === JSON.stringify(song);
  if (isDataIdentical) {
    console.warn("No changes detected between existing and new song data.");
    throw new Error("Update failed: No changes detected.");
  }

  // Ensure all fields are updated by spreading existing data and overwriting with new data
  const updatedSongData = { ...existingData, ...song };
  console.log("Updated song data to be sent:", song);

  const { data, error } = await supabase
    .from("songs")
    .update(song)
    .eq("id", song.id)
    .select();

  console.log("Response from update attempt:", data);

  if (error) {
    console.error("Error in updateSong:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : JSON.stringify(error, Object.getOwnPropertyNames(error));

    throw new Error(`Error updating song: ${errorMessage}`);
  }

  if (!data || data.length === 0) {
    console.warn(
      "No rows were updated. This could mean the song ID is incorrect or no changes were made to the existing record."
    );
    console.log("Response from update attempt:", data);
    throw new Error("Update failed: No rows were updated.");
  }

  console.log("Updated data:", data);
  return data;
}
