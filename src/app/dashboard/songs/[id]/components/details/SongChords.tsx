import { Song } from '@/types/Song';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Guitar } from 'lucide-react';

interface SongChordsProps {
  song: Song;
}

export function SongChords({ song }: SongChordsProps) {
  if (!song.chords) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Guitar className="h-5 w-5" />
          Chords
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md">
          <pre className="whitespace-pre-wrap font-mono text-sm">{song.chords}</pre>
        </div>
      </CardContent>
    </Card>
  );
} 