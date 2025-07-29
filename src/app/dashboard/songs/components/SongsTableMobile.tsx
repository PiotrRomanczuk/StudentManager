"use client";

import { Song } from '@/types/Song';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from './SongsTable';
import type { SortField } from './SongsTable';
import { useSearchParams, useRouter } from 'next/navigation';

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

  return (
    <div className="space-y-4">
      {/* Sort indicator for mobile */}
      <div className="text-sm text-muted-foreground">
        Sorted by: {currentSortBy.replace('_', ' ')} ({currentSortOrder})
      </div>

      {/* Mobile card layout */}
      <div className="grid gap-4">
        {songs.map((song) => (
          <Card key={song.id} data-testid="song-card">
            <CardHeader>
              <CardTitle className="text-lg">{song.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Author:</span>
                <span className="font-medium">{song.author}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Level:</span>
                <Badge variant="secondary">{song.level}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Key:</span>
                <span className="font-medium">{song.key}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Created:</span>
                <span className="text-sm">{formatDate(song.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Updated:</span>
                <span className="text-sm">{formatDate(song.updated_at)}</span>
              </div>
              <div className="pt-2">
                <Button onClick={() => handleViewSong(song)} size="sm" className="w-full">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 