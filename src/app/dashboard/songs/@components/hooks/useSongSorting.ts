import { useState } from "react";
import { Song } from "@/types/Song";

export function useSongSorting() {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Song | null;
    direction: "asc" | "desc";
  }>({
    key: "updated_at",
    direction: "desc",
  });

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
    sortConfig,
    handleSort,
    getSortIndicator,
  };
}
