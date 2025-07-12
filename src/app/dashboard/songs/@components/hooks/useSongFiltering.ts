import { useState, useMemo } from "react";
import { Song } from "@/types/Song";

export function useSongFiltering(songs: Song[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs;

    const trimmedQuery = searchQuery.trim().toLowerCase();
    return songs.filter((song) =>
      song.title.toLowerCase().includes(trimmedQuery),
    );
  }, [songs, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredSongs,
  };
}
