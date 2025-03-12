import { Song } from "@/types/Song";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

interface ShortSongTableProps {
  songs: Song[];
}

export function ShortSongTable({ songs }: ShortSongTableProps) {
  // Take only the first 5 songs
  const displaySongs = songs.slice(0, 5);

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-primary">
          Recent Songs
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Your latest added songs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Title</TableHead>
              {/* <TableHead className="font-semibold">Artist</TableHead>
              <TableHead className="font-semibold text-right">
                Duration
              </TableHead> */}
              <TableHead className="font-semibold">More Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displaySongs.map((song) => (
              <TableRow
                key={song.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-medium">{song.title}</TableCell>
                {/* <TableCell className="text-muted-foreground">
                  {song.author}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {song.key}
                </TableCell> */}
                <TableCell className="text-muted-foreground">
                  <Link
                    href={`/dashboard/songs/${song.id}`}
                    className="text-blue-500 hover:text-blue-600 font-bold"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
