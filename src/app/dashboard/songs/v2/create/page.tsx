"use client";

import React from "react";
import { SongEditForm } from "@/app/dashboard/songs/v2/[song]/@components/SongForm";
import { Song } from "@/types/Song";
import { handleSongCreate, handleCancel } from "./formHandlers";

export default function Page() {
  const defaultSong: Song = {
    id: "",
    title: "",
    author: "",
    level: "beginner",
    key: "",
    chords: "",
    audio_files: "",
    ultimate_guitar_link: "",
    short_title: "",
    created_at: new Date(),
    updated_at: new Date(),
  };

  return (
    <div>
      <h1 className="text-3xl font-bold pl-6 pt-4 mb-6">New Song</h1>
      <SongEditForm
        song={defaultSong}
        mode="create"
        loading={false}
        error={null}
        onSubmit={handleSongCreate}
        onCancel={handleCancel}
      />
    </div>
  );
}
