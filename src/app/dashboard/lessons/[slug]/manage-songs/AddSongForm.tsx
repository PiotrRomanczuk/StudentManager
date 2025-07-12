"use client";

import { SongSearchBar } from "@/app/dashboard/songs/@components/SongSearchBar";
import { Button } from "@/components/ui/button";
import { addSongToLesson } from "./actions";
import type { Song } from "@/types/Song";
import { useState } from "react";

type AddSongFormProps = {
  songs: Song[];
  assignedSongIds: string[];
  slug: string;
};

export default function AddSongForm({
  songs,
  assignedSongIds,
  slug,
}: AddSongFormProps) {
  const [selectedSongId, setSelectedSongId] = useState<string>("");

  const availableSongs = songs.filter(
    (song) => !assignedSongIds.includes(song.id),
  );

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSelectedSongId("");
      return;
    }

    const matchingSong = availableSongs.find((song) =>
      song.title.toLowerCase().includes(query.toLowerCase()),
    );
    if (matchingSong) {
      setSelectedSongId(matchingSong.id);
    } else {
      setSelectedSongId("");
    }
  };

  return (
    <div className="bg-admin-gray-lightest p-6 rounded-lg border border-admin-gray-light shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-admin-gray-darker">
        Add Song to Lesson
      </h2>
      <form
        action={async (formData) => {
          if (selectedSongId) {
            formData.append("songId", selectedSongId);
            await addSongToLesson(formData, slug);
          }
        }}
        className="flex items-end gap-4"
      >
        <div className="flex-1">
          <SongSearchBar songs={availableSongs} onSearch={handleSearch} />
        </div>
        <Button
          type="submit"
          disabled={!selectedSongId}
          className="bg-admin-blue hover:bg-admin-blue-dark text-white transition-colors"
        >
          Add Song
        </Button>
      </form>
    </div>
  );
}
