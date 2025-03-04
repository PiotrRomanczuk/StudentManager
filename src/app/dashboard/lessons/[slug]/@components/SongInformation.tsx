import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Song } from "@/types/Song";
import { Badge } from "@/components/ui/badge";
import { Music } from "lucide-react";
import Link from "next/link";

export default function SongInformation({ lesson }: { lesson: { songs: Song[]; id: string } }) {
    return (
        <Card className="flex-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Songs</CardTitle>
            <Badge variant="outline" className="ml-2">
              {lesson.songs?.length || 0}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!lesson.songs || lesson.songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Music className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No songs added to this lesson yet.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {lesson.songs.map((song: Song) => (
                <li key={song.id} className="rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" />
                    <span className="font-medium">{song.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/dashboard/lessons/${lesson.id}/manage-songs`}>
              Manage Songs
            </Link>
          </Button>
        </CardFooter>   
      </Card>                  );
}
