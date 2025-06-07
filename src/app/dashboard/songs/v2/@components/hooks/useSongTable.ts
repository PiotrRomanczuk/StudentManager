import { useMemo } from "react";
import { Song } from "@/types/Song";

export function useSongTable(
  songs: Song[],
  currentPage: number,
  itemsPerPage: number,
) {
  const currentSongs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return songs.slice(startIndex, endIndex);
  }, [songs, currentPage, itemsPerPage]);

  return {
    currentSongs,
  };
}
