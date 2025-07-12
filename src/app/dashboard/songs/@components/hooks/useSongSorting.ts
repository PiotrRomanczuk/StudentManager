import { useState, useMemo } from "react";
import { Song } from "@/types/Song";

export function useSongSorting(songs: Song[]) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Song | null;
    direction: "asc" | "desc";
  }>({
    key: "updated_at",
    direction: "desc",
  });

  const sortedSongs = useMemo(() => {
    if (!songs || songs.length === 0) return [];
    
    const sorted = [...songs].sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
    
    return sorted;
  }, [songs, sortConfig]);

  const handleSort = (key: keyof Song) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIndicator = (key: keyof Song) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  return {
    sortKey: sortConfig.key,
    sortDirection: sortConfig.direction,
    sortedSongs,
    handleSort,
    getSortIndicator,
  };
}
