"use client";

import { Song } from '@/types/Song';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Music, Calendar } from 'lucide-react';
import { formatDate } from './SongsTable';
import type { SortField } from './SongsTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/data-table';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentSortBy = searchParams.get('sortBy') || 'created_at';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentSortOrder = searchParams.get('sortOrder') || 'desc';

  const getLevelColor = (level: string | null) => {
    if (!level) {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
    
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <DataTable>
      <TableHeader>
        <TableRow className="bg-gray-50 hover:bg-gray-50">
          <TableHead className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
            <button
              onClick={() => handleSort('title')}
              className="flex items-center gap-1 hover:text-gray-700"
            >
              Title
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </TableHead>
          <TableHead className="hidden sm:table-cell px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1">
            <button
              onClick={() => handleSort('author')}
              className="flex items-center justify-center gap-1 hover:text-gray-700"
            >
              Author
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </TableHead>
          <TableHead className="hidden sm:table-cell px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
            <button
              onClick={() => handleSort('level')}
              className="flex items-center gap-1 hover:text-gray-700"
            >
              Level
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </TableHead>
          <TableHead className="hidden sm:table-cell px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
            <button
              onClick={() => handleSort('key')}
              className="flex items-center gap-1 hover:text-gray-700"
            >
              Key
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </TableHead>
          <TableHead className="hidden sm:table-cell px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
            <button
              onClick={() => handleSort('created_at')}
              className="flex items-center gap-1 hover:text-gray-700"
            >
              Created
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </TableHead>
          <TableHead className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs.map((song) => (
          <TableRow
            key={song.id}
            className="hover:bg-gray-50 transition-colors"
          >
            <TableCell className="px-3 sm:px-6 py-4 align-top">
              <div className="flex items-start gap-3">
                <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <Music className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div
                    className="text-sm font-medium text-gray-900 cursor-pointer hover:underline"
                    title="Filter by this title"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('search', song.title);
                      params.set('page', '1');
                      router.push(`/dashboard/songs?${params.toString()}`);
                    }}
                  >
                    {song.title}
                  </div>
                  <div
                    className="text-xs text-gray-500 mt-1 cursor-pointer hover:underline"
                    title="Filter by this author"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('author', song.author);
                      params.set('page', '1');
                      router.push(`/dashboard/songs?${params.toString()}`);
                    }}
                  >
                    {song.author}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell px-1 py-4 text-center align-top w-1">
            </TableCell>
            <TableCell className="hidden sm:table-cell px-2 py-4">
              <Badge
                variant="outline"
                className={`${getLevelColor(song.level)} border-transparent`}
              >
                {song.level}
              </Badge>
            </TableCell>
            <TableCell className="hidden sm:table-cell px-2 py-4">
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-orange-600">
                    {song.key}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {song.key}
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell px-2 py-4">
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-3 w-3 text-green-600" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 border-green-200 text-xs"
                >
                  {formatDate(song.created_at)}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="px-3 sm:px-6 py-4 text-right">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewSong(song)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300"
              >
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTable>
  );
} 