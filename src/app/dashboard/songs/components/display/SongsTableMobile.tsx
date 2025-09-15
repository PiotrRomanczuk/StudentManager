"use client";

import { Song } from '@/types/Song';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, User, Calendar } from 'lucide-react';
import { formatDate } from './SongsTable';
import type { SortField } from './SongsTable';
import { useSearchParams, useRouter } from 'next/navigation';
import { DataCard } from '@/components/ui/data-card';

interface SongsTableMobileProps {
  songs: Song[];
  sortField?: SortField;
  sortDirection?: string;
  onSort?: (field: SortField) => void;
}

export function SongsTableMobile({ songs }: SongsTableMobileProps) {
  const searchParams = useSearchParams();
  const currentSortBy = searchParams.get('sortBy') || 'created_at';
  const currentSortOrder = searchParams.get('sortOrder') || 'desc';
  const router = useRouter();

  const handleViewSong = (song: Song) => {
    router.push(`/dashboard/songs/${song.id}`);
  };

  const getLevelColor = (level: string) => {
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

  if (!songs.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No songs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort indicator for mobile */}
      <div className="text-sm text-muted-foreground">
        Sorted by: {currentSortBy.replace('_', ' ')} ({currentSortOrder})
      </div>

      {/* Mobile card layout */}
      <div className="grid gap-4">
        {songs.map((song) => (
          <DataCard key={song.id} data-testid="song-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Music className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {song.title}
                  </div>
                  <Badge
                    variant="outline"
                    className="mt-1 bg-blue-100 text-blue-800 border-blue-200"
                  >
                    {song.author}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewSong(song)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300"
              >
                View Details
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-gray-900">
                  {song.author}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`${getLevelColor(song.level)} border-transparent`}
                >
                  {song.level}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-orange-600">
                    {song.key}
                  </span>
                </div>
                <span className="text-gray-900">
                  {song.key}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-900">
                  {formatDate(song.created_at)}
                </span>
              </div>
            </div>
          </DataCard>
        ))}
      </div>
    </div>
  );
} 