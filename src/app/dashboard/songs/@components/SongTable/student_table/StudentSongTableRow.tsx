import { TableRow, TableCell } from "@/components/ui/table";
import { Song } from "@/types/Song";
import SongTableActions from "../SongTableActions";
import React from "react";

interface SongTableRowProps {
  song: Song;
  isAdmin?: boolean;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  hideStatus?: boolean;
}

const StudentSongTableRow: React.FC<SongTableRowProps> = ({
  song,
  isAdmin,
  onEdit,
  onView,
  onDelete,
  hideStatus = false,
}) => {
  return (
    <TableRow
      key={song.id}
      className="hover:bg-gray-50 transition-colors min-h-14"
      aria-label={`Song row for ${song.title}`}
    >
      {/* Status */}
      {!hideStatus && (
        <TableCell className="px-6 py-2 w-12" aria-label="Status">
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${song.status ? `bg-songStatus-${song.status}-bg text-songStatus-${song.status}-text` : "bg-gray-100 text-gray-800"}`}
            title={song.status}
          >
            {song.status ? song.status.replace(/_/g, " ") : "—"}
          </span>
        </TableCell>
      )}
      {/* Title & Author */}
      <TableCell className="px-6 py-2 flex-1 min-w-[180px]" aria-label="Title and Author">
        <div className="flex flex-col items-start">
          <div className="text-sm font-medium text-gray-900">
            {song.title}
          </div>
          <div className="text-sm text-gray-500">{song.author}</div>
        </div>
      </TableCell>
      {/* Key */}
      <TableCell className="px-6 py-2 w-20 max-w-[60px] text-center items-center justify-center" aria-label="Key">
        <span
          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800"
          title={song.key}
        >
          {song.key}
        </span>
      </TableCell>
      {/* Level */}
      <TableCell className="px-6 py-2 w-20 max-w-[60px] text-center items-center justify-center" aria-label="Level">
        <span
          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
          title={song.level}
        >
          {song.level?.slice(0, 3).toUpperCase()}
        </span>
      </TableCell>
      {/* Updated At */}
      <TableCell
        className="px-6 py-2 text-xs text-gray-500 text-center items-center justify-center"
        aria-label="Updated At"
      >
        {new Date(song.updated_at || song.created_at).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
      {/* Actions */}
      {(isAdmin !== undefined || isAdmin === false) && (
        <TableCell className="px-6 py-2 flex gap-1" aria-label="Actions">
          <SongTableActions
            song={song}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
          />
        </TableCell>
      )}
    </TableRow>
  );
};

export default StudentSongTableRow;
