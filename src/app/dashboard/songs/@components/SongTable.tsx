"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Song } from "@/types/Song";
import { SongRow } from "./SongRow";

export function SongTable({
  songs,
  headers,
  actions,
  showStatus,
  onSort,
  getSortIndicator,
}: {
  songs: Song[];
  headers: { key: string; label: string }[];
  actions: ("edit" | "delete" | "view")[];
  showStatus: boolean;
  onSort: (key: keyof Song) => void;
  getSortIndicator: (key: keyof Song) => string;
}) {
  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          Songs Library
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                {headers.map((head) => (
                  <TableHead
                    key={`header-${head.key}`}
                    className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => onSort(head.key as keyof Song)}
                  >
                    <div className="flex items-center gap-1">
                      {head.label}
                      {getSortIndicator(head.key as keyof Song)}
                    </div>
                  </TableHead>
                ))}
                {/* Always render Actions as the last column if actions are present */}
                {actions.length > 0 && (
                  <TableHead className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 min-w-fit w-auto">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {songs.map((song, index) => (
                <SongRow
                  key={`${song.id}-${index}`}
                  song={song}
                  actions={actions}
                  showStatus={showStatus}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
