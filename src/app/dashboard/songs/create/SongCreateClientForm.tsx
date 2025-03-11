"use client";

import { redirect } from "next/navigation";
import React from "react";
import { SongEditForm } from "@/components/dashboard/forms/SongEditForm";
import { CreateSongDTO, Song } from "@/types/Song";
import { createGuid } from "@/utils/createGuid";

type Params = { song: Song };

const SongCreateClientForm = ({ song }: { song: Song }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold pl-6 pt-4 mb-6">New Song</h1>
      <SongEditForm
        song={song}
        mode="create"
        loading={false}
        error={null}
        onSubmit={async (songToCreate: Partial<Song>) => {
          const newSong: CreateSongDTO = {
            id: createGuid(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            title: songToCreate.title || "",
            author: songToCreate.author || "",
            level: songToCreate.level || "beginner",
            key: songToCreate.key || "",
            chords: songToCreate.chords || undefined,
            audio_files: songToCreate.audio_files || undefined,
            ultimate_guitar_link:
              songToCreate.ultimate_guitar_link || undefined,
            short_title: songToCreate.short_title || undefined,
          };

          const response = await fetch("/api/song/create", {
            method: "POST",
            body: JSON.stringify(newSong),
          });

          if (response.ok) {
            console.log(`Song created successfully: ${newSong.title}`);
            redirect("/dashboard/songs");
          }
        }}
        onCancel={() => redirect(`/dashboard/songs`)}
      />
    </div>
  );
};

export default SongCreateClientForm;
