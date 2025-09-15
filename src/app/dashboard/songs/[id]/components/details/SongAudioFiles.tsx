import { Song } from '@/types/Song';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SongAudioFilesProps {
  song: Song;
}

export function SongAudioFiles({ song }: SongAudioFilesProps) {
  if (!song.audio_files) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {typeof song.audio_files === 'string' ? (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">{song.audio_files}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(song.audio_files).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="font-medium">{key}</span>
                  <span className="text-sm text-gray-600">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 