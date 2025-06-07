"use client";

import { useRouter } from "next/navigation";
import { SongsTableProps } from "../../types/tableTypes";
import { useSongTable } from "../../hooks/useSongTable";
import React from "react";

export function StudentSongTableMobile({
  songs,
  currentPage,
  itemsPerPage,
}: Omit<SongsTableProps, "isAdmin">) {
  const router = useRouter();
  const { currentSongs } = useSongTable(songs, currentPage, itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Songs Library
        </h3>
        <div className="space-y-3">
          {currentSongs.map((song, index) => (
            <div
              key={`${song.id}-${index}`}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {song.title.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {song.title}
                    </div>
                  </div>
                </div>
                <button
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 rounded px-3 py-1 text-xs font-medium"
                  onClick={() => router.push(`/dashboard/songs/${song.id}`)}
                >
                  View
                </button>
              </div>
              {/* Status */}
              {song.status && (
                <div className="mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold bg-songStatus-${song.status}-bg text-songStatus-${song.status}-text`}
                  >
                    {song.status.replace(/_/g, " ")}
                  </span>
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {song.level}
                </span>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                  {song.key}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {new Date(song.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
