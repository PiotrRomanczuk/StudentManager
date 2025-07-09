"use client";

import { SongForm } from "../@components/SongForm";
import { Song } from "@/types/Song";
import { handleSongUpdate, handleCancel } from "./formHandlers";

const SongEditClientForm = ({
  song,
  mode,
}: {
  song: Song;
  mode: "create" | "edit";
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{song.title}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {mode === "edit" ? "Edit song details" : "Create new song"}
        </p>
      </div>
      <SongForm
        song={song}
        mode="edit"
        songId={song.id}
        loading={false}
        error={null}
        onSubmit={(songToUpdate) => handleSongUpdate(song, songToUpdate)}
        onCancel={() => handleCancel(song.id)}
      />
    </div>
  );
};

export default SongEditClientForm;
