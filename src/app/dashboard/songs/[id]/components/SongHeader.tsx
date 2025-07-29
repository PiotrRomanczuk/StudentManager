import { Song } from '@/types/Song';

interface SongHeaderProps {
  song: Song;
}

export function SongHeader({ song }: SongHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{song.title}</h1>
      <p className="text-lg text-gray-600">by {song.author}</p>
    </div>
  );
} 