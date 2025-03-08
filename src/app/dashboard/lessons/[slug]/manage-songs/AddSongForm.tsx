'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { addSongToLesson } from "./actions";
import type { Song } from "@/types/Song";

type AddSongFormProps = {
  songs: Song[];
  assignedSongIds: string[];
  slug: string;
};

export default function AddSongForm({ songs, assignedSongIds, slug }: AddSongFormProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Add Song to Lesson</h2>
      <form
        action={async (formData) => {
          await addSongToLesson(formData, slug);
        }}
        className="flex items-end gap-4"
      >
        <div className="flex-1">
          <Select name="songId">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a song" />
            </SelectTrigger>
            <SelectContent>
              {songs
                ?.filter((song: Song) => !assignedSongIds.includes(song.id))
                .map((song: Song) => (
                  <SelectItem key={song.id} value={song.id}>
                    {song.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Add Song</Button>
      </form>
    </div>
  );
}