import { Song } from '@/types/Song';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface SongExternalLinksProps {
  song: Song;
}

export function SongExternalLinks({ song }: SongExternalLinksProps) {
  if (!song.ultimate_guitar_link) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>External Links</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          asChild
          className="w-full justify-start"
        >
          <a 
            href={song.ultimate_guitar_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            View on Ultimate Guitar
          </a>
        </Button>
      </CardContent>
    </Card>
  );
} 