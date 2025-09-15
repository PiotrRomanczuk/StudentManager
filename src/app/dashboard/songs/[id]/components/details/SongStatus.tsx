import { Song } from '@/types/Song';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SongStatusProps {
  song: Song;
}

export function SongStatus({ song }: SongStatusProps) {
  if (!song.status) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="capitalize">
          {song.status.replace('_', ' ')}
        </Badge>
      </CardContent>
    </Card>
  );
} 