import { Song } from '@/types/Song';

interface AdminInfoProps {
  song: Song;
}

export function AdminInfo({ song }: AdminInfoProps) {
  return (
    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <h2 className="text-lg font-semibold text-blue-800 mb-2">Admin Information</h2>
      <div className="space-y-2">
        <p className="text-blue-700">
          <span className="font-medium">Song ID:</span> {song.id}
        </p>
        <p className="text-blue-700">
          <span className="font-medium">Created:</span> {new Date(song.created_at).toLocaleDateString()}
        </p>
        <p className="text-blue-700">
          <span className="font-medium">Last Updated:</span> {new Date(song.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 