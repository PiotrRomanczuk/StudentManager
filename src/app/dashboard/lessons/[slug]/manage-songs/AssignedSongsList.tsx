"use client";

import { Button } from "@/components/ui/button";
import type { Song } from "@/types/Song";
import { removeSongFromLesson } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SongStatusEnum } from "@/schemas";

type LessonSong = {
  song_id: string;
  song_status: string;
};

type AssignedSongsListProps = {
  songs: Song[];
  assignedSongIds: string[];
  lessonSongs: LessonSong[];
  slug: string;
};

const statusColorMap: Record<string, string> = {
  to_learn: "bg-yellow-100 text-yellow-800",
  started: "bg-blue-100 text-blue-800",
  remembered: "bg-green-100 text-green-800",
  with_author: "bg-purple-100 text-purple-800",
  mastered: "bg-gray-200 text-gray-800",
};

export default function AssignedSongsList({
  songs,
  assignedSongIds,
  lessonSongs,
  slug,
}: AssignedSongsListProps) {
  const router = useRouter();
  
  // Get song status options from the schema
  const songStatusOptions = SongStatusEnum.options;

  return (
    <div className="bg-admin-gray-lightest p-6 rounded-lg border border-admin-gray-light">
      <h2 className="text-xl font-semibold mb-4 text-admin-gray-darker">
        Assigned Songs
      </h2>
      {assignedSongIds.length === 0 ? (
        <p className="text-admin-gray-DEFAULT">
          No songs assigned to this lesson yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {songs
            ?.filter((song: Song) => assignedSongIds.includes(song.id))
            .map((song: Song) => {
              const lessonSong = lessonSongs?.find(
                (ls) => ls.song_id === song.id,
              );
              
              // Validate song status against schema
              const isValidStatus = lessonSong && lessonSong.song_status ? 
                songStatusOptions.includes(lessonSong.song_status as "to_learn" | "started" | "remembered" | "with_author" | "mastered") : 
                false;
              
              const displayStatus = isValidStatus && lessonSong ? 
                lessonSong.song_status.replace(/_/g, " ") : 
                "Unknown";
              
              return (
                <li
                  key={song.id}
                  className="flex items-center justify-between p-3 bg-admin-blue-light rounded-md border border-admin-gray-light hover:bg-admin-blue-light/80 transition-colors"
                >
                  <span className="text-admin-gray-darker font-medium">
                    {song.title}
                  </span>
                  {lessonSong && (
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${statusColorMap[lessonSong.song_status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {displayStatus}
                    </span>
                  )}
                  <form
                    action={async (formData) => {
                      try {
                        await removeSongFromLesson(formData, slug);
                        toast.success("Song removed from lesson.");
                        router.refresh();
                      } catch (error) {
                        toast.error(
                          `Failed to remove song from lesson: ${error}`,
                        );
                      }
                    }}
                  >
                    <input type="hidden" name="songId" value={song.id} />
                    <Button
                      variant="destructive"
                      size="sm"
                      type="submit"
                      className="hover:bg-destructive/90"
                    >
                      Remove
                    </Button>
                  </form>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
