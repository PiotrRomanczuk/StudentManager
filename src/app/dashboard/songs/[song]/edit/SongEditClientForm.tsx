"use client";

import { redirect } from "next/navigation";
import { SongEditForm } from "@/components/dashboard/forms/SongEditForm";
import { CreateSongDTO, Song } from "@/types/Song";

const SongEditClientForm = ({
  song,
  mode,
}: {
  song: Song;
  mode: "create" | "edit";
}) => {
  console.log("song edit client form song", song);
  console.log("song edit client form mode", mode);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{song.title}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {mode === "edit" ? "Edit song details" : "Create new song"}
        </p>
      </div>
      <SongEditForm
        song={song}
        mode="edit"
        songId={song.id}
        loading={false}
        error={null}
        onSubmit={async (songToUpdate: Partial<Song>) => {
          const newSong: CreateSongDTO = {
            id: song.id,
            created_at: song.created_at,
            updated_at: new Date(),
            title: songToUpdate.title || "",
            author: songToUpdate.author || "",
            level: songToUpdate.level || "beginner",
            key: songToUpdate.key || "",
            chords: songToUpdate.chords || undefined,
            audio_files: songToUpdate.audio_files || undefined,
            ultimate_guitar_link:
              songToUpdate.ultimate_guitar_link || undefined,
            short_title: songToUpdate.short_title || undefined,
          };

          const response = await fetch(`/api/song/update`, {
            method: "PUT",
            body: JSON.stringify(newSong),
          });

          if (response.status === 404) {
            console.error("Song not found");
            return;
          }

          if (response.ok) {
            console.log(`Song updated successfully: ${newSong.title}`);
            redirect(`/dashboard/songs/${song.id}`);
          }
        }}
        onCancel={() => redirect(`/dashboard/songs/${song.id}`)}
      />
    </div>
  );
};

export default SongEditClientForm;
