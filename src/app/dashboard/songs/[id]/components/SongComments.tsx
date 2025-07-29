import { Song } from '@/types/Song';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SongCommentsProps {
  song: Song;
}

export function SongComments({ song }: SongCommentsProps) {
  if (!song.comments) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm">{song.comments}</p>
        </div>
      </CardContent>
    </Card>
  );
} 