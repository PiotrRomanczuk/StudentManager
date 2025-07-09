import { useState, useMemo } from "react";
import { Song } from "@/types/Song";

export function useSongFiltering(songs: Song[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = useMemo(() => {
    if (!searchQuery) return songs;

    return songs.filter((song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [songs, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredSongs,
  };
}
