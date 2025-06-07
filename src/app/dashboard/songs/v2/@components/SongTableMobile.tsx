"use client";
import { Song } from "@/types/Song";
import { SongCardMobile } from "./SongCardMobile";

export function SongTableMobile({
  songs,
  actions,
  showStatus,
}: {
  songs: Song[];
  actions: ("edit" | "delete" | "view")[];
  showStatus: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Songs Library
        </h3>
        <div className="space-y-3">
          {songs.map((song, index) => (
            <SongCardMobile
              key={`${song.id}-${index}`}
              song={song}
              actions={actions}
              showStatus={showStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
