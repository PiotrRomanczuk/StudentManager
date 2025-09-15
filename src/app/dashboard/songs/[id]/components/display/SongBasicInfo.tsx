import { Song } from '@/types/Song';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music } from 'lucide-react';

interface SongBasicInfoProps {
  song: Song;
}

export function SongBasicInfo({ song }: SongBasicInfoProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Song Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Level</label>
            <div className="mt-1">
              <Badge className={getLevelColor(song.level)}>
                {song.level}
              </Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Key</label>
            <p className="mt-1 text-lg font-semibold">{song.key}</p>
          </div>
        </div>
        
        {song.short_title && (
          <div>
            <label className="text-sm font-medium text-gray-500">Short Title</label>
            <p className="mt-1">{song.short_title}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 