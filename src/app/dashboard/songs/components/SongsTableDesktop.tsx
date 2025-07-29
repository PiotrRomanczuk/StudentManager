"use client";

import { Song } from '@/types/Song';
import { Button } from '@/components/ui/button';
import { formatDate } from './SongsTable';
import type { SortField } from './SongsTable';
import { useRouter, useSearchParams } from 'next/navigation';

interface SongsTableDesktopProps {
  songs: Song[];
  sortField?: SortField;
  sortDirection?: string;
  onSort?: (field: SortField) => void;
}

export function SongsTableDesktop({ songs }: SongsTableDesktopProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleViewSong = (song: Song) => {
    router.push(`/dashboard/songs/${song.id}`);
  };

  const handleSort = (field: SortField) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSortBy = searchParams.get('sortBy') || 'created_at';
    const currentSortOrder = searchParams.get('sortOrder') || 'desc';
    
    let newSortOrder = 'asc';
    if (currentSortBy === field) {
      // If clicking the same field, toggle the order
      newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    }
    
    params.set('sortBy', field);
    params.set('sortOrder', newSortOrder);
    params.set('page', '1'); // Reset to first page when sorting
    
    router.push(`/dashboard/songs?${params.toString()}`);
  };

  const currentSortBy = searchParams.get('sortBy') || 'created_at';
  const currentSortOrder = searchParams.get('sortOrder') || 'desc';

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('title')}
            >
              Title
              {currentSortBy === 'title' && (currentSortOrder === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('author')}
            >
              Author
              {currentSortBy === 'author' && (currentSortOrder === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('level')}
            >
              Level
              {currentSortBy === 'level' && (currentSortOrder === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('key')}
            >
              Key
              {currentSortBy === 'key' && (currentSortOrder === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('created_at')}
            >
              Created At
              {currentSortBy === 'created_at' && (currentSortOrder === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('updated_at')}
            >
              Updated At
              {currentSortBy === 'updated_at' && (currentSortOrder === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {songs.map((song) => (
            <tr key={song.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {song.title}
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {song.author}
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  {song.level}
                </span>
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {song.key}
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {formatDate(song.created_at)}
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {formatDate(song.updated_at)}
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                <Button variant="outline" size="sm" onClick={() => handleViewSong(song)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 