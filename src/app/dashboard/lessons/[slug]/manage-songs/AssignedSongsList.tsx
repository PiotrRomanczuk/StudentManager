"use client";

import { Button } from "@/components/ui/button";
import type { Song } from "@/types/Song";
import { removeSongFromLesson } from "./actions";

type AssignedSongsListProps = {
  songs: Song[];
  assignedSongIds: string[];
  slug: string;
};

export default function AssignedSongsList({
  songs,
  assignedSongIds,
  slug,
}: AssignedSongsListProps) {
  return (
    <div className="bg-admin-gray-lightest p-6 rounded-lg border border-admin-gray-light">
      <h2 className="text-xl font-semibold mb-4 text-admin-gray-darker">Assigned Songs</h2>
      {assignedSongIds.length === 0 ? (
        <p className="text-admin-gray-DEFAULT">
          No songs assigned to this lesson yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {songs
            ?.filter((song: Song) => assignedSongIds.includes(song.id))
            .map((song: Song) => (
              <li
                key={song.id}
                className="flex items-center justify-between p-3 bg-admin-blue-light rounded-md border border-admin-gray-light hover:bg-admin-blue-light/80 transition-colors"
              >
                <span className="text-admin-gray-darker font-medium">{song.title}</span>
                <form
                  action={async (formData) => {
                    await removeSongFromLesson(formData, slug);
                  }}
                >
                  <input type="hidden" name="songId" value={song.id} />
                  <Button variant="destructive" size="sm" type="submit" className="hover:bg-destructive/90">
                    Remove
                  </Button>
                </form>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
