import { Song } from '@/types/Song';
import { Button } from '@/components/ui/button';
import { formatDate } from './SongsTable';
import type { SortField } from './SongsTable';

interface SongsTableDesktopProps {
  songs: Song[];
  sortField: SortField;
  sortDirection: string;
  onSort: (field: SortField) => void;
  onView?: (song: Song) => void;
}

export function SongsTableDesktop({ songs, sortField, sortDirection, onSort, onView }: SongsTableDesktopProps) {
  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('title')}
              data-sort-direction={sortField === 'title' ? sortDirection : undefined}
            >
              Title
              {sortField === 'title' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('author')}
              data-sort-direction={sortField === 'author' ? sortDirection : undefined}
            >
              Author
              {sortField === 'author' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('level')}
              data-sort-direction={sortField === 'level' ? sortDirection : undefined}
            >
              Level
              {sortField === 'level' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('key')}
              data-sort-direction={sortField === 'key' ? sortDirection : undefined}
            >
              Key
              {sortField === 'key' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('created_at')}
              data-sort-direction={sortField === 'created_at' ? sortDirection : undefined}
            >
              Created At
              {sortField === 'created_at' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th 
              className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
              onClick={() => onSort('updated_at')}
              data-sort-direction={sortField === 'updated_at' ? sortDirection : undefined}
            >
              Updated At
              {sortField === 'updated_at' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {songs.map((song) => (
            <tr key={song.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {song.title}
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {song.author}
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  {song.level}
                </span>
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {song.key}
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {formatDate(song.created_at)}
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {formatDate(song.updated_at)}
              </td>
              <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                {onView && (
                  <Button variant="outline" size="sm" onClick={() => onView(song)}>
                    View
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 