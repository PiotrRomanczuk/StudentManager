import { Song } from '@/types/Song';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SongMetadataProps {
  song: Song;
}

export function SongMetadata({ song }: SongMetadataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Song Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">ID</span>
          <span className="text-sm font-mono">{song.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Created</span>
          <span className="text-sm">
            {new Date(song.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Updated</span>
          <span className="text-sm">
            {new Date(song.updated_at).toLocaleDateString()}
          </span>
        </div>
        {song.is_favorite && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <Badge variant="secondary" className="text-xs">
              Favorite
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 