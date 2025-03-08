"use client";

import useSongForm from "@/hooks/useSongForm";
import { redirect } from "next/navigation";
import React from "react";
import { SongEditForm } from "./@components/SongEditForm";
import { Song } from "@/types/Song";
import { updateSong } from "./updateSong";
import { normalizeSongData } from "@/utils/normalizeSongData";

const SongEditClientForm = ({ song }: { song: Song }) => {


  const {
    loading: formLoading,
    error: formError,
  } = useSongForm({
    mode: "edit",
    songId: song.id,
    initialData: song,
    onSuccess: () => redirect(`/dashboard/songs/${song.id}`),
  });

  console.log("song edit client form song", song);

  return (
    <div>
      <h1 className="text-3xl font-bold pl-6 pt-4 mb-6">{song.title}</h1>
      <SongEditForm
        song={song}
        mode="edit"
        songId={song.id}
        loading={formLoading}
        error={formError}
        onSubmit={async (normalizedData) => {
          try {
            const formattedData = normalizeSongData(normalizedData, song);
            console.log("formattedData", formattedData);
            await updateSong(formattedData as Song); // Type assertion to fix type error
            redirect(`/dashboard/songs/${song.id}`);
          } catch (error) {
            console.error("Error updating song:", error); // Log the error for debugging
        
            // Attempt to stringify the error object for better logging
            const errorMessage = error instanceof Error 
              ? error.message 
              : JSON.stringify(error, Object.getOwnPropertyNames(error));
        
            // Only throw an error if it's not a redirect
            if (errorMessage !== 'NEXT_REDIRECT') {
              throw new Error("Error updating song: " + errorMessage);
            }
          }
        }}
        onCancel={() => redirect(`/dashboard/songs/${song.id}`)}
      />
    </div>
  );
};

export default SongEditClientForm;