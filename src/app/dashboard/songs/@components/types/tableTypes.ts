import { Song } from "@/types/Song";

export interface SongsTableProps {
  songs: Song[];
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export interface SortConfig {
  key: keyof Song | null;
  direction: "asc" | "desc";
}

export interface TableFilters {
  title: string;
  author: string;
  level: string;
  key: string;
}
