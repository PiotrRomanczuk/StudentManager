import { Song } from '@/types/Song';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from './SongsTable';
import type { SortField } from './SongsTable';

interface SongsTableMobileProps {
  songs: Song[];
  sortField: SortField;
  sortDirection: string;
  onSort: (field: SortField) => void;
  onView?: (song: Song) => void;
}

export function SongsTableMobile({ songs, sortField, sortDirection, onSort, onView }: SongsTableMobileProps) {
  return (
    <div className="space-y-4">
      {/* Mobile sort controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <select
          value={sortField}
          onChange={(e) => onSort(e.target.value as SortField)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="level">Level</option>
          <option value="key">Key</option>
          <option value="created_at">Created At</option>
          <option value="updated_at">Updated At</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSort(sortField)}
        >
          {sortDirection === 'asc' ? '↑' : '↓'}
        </Button>
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
              {onView && (
                <div className="pt-2">
                  <Button onClick={() => onView(song)} size="sm" className="w-full">
                    View
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 