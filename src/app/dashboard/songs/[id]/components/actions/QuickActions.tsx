'use client';

import { Song } from '@/types/Song';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  HeartOff,
  Share2,
  Download,
  BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuickActionsProps {
  song: Song;
  isDisabled: boolean;
}

export function QuickActions({ song, isDisabled }: QuickActionsProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(song.is_favorite || false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const handleToggleFavorite = async () => {
    setIsFavoriting(true);
    const favoriteToast = toast.loading(
      isFavorite ? 'Removing from favorites...' : 'Adding to favorites...'
    );

    try {
      // TODO: Implement favorite toggle functionality
      // const response = await fetch(`/api/songs/${song.id}/favorite`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ is_favorite: !isFavorite }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to update favorites');
      // }

      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite ? 'Removed from favorites' : 'Added to favorites', 
        { id: favoriteToast }
      );
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast.error('Failed to update favorites. Please try again.', { id: favoriteToast });
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleShare = async () => {
    const shareToast = toast.loading('Preparing share...');

    try {
      if (navigator.share) {
        await navigator.share({
          title: song.title,
          text: `Check out "${song.title}" by ${song.author}`,
          url: window.location.href,
        });
        toast.success('Shared successfully', { id: shareToast });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard', { id: shareToast });
      }
    } catch (error) {
      console.error('Share error:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled the share
        toast.dismiss(shareToast);
      } else {
        toast.error('Failed to share. Please try again.', { id: shareToast });
      }
    }
  };

  const handleDownload = () => {
    const downloadToast = toast.loading('Preparing download...');

    try {
      // TODO: Implement download functionality
      // const response = await fetch(`/api/songs/${song.id}/download`);
      // if (!response.ok) {
      //   throw new Error('Failed to download song');
      // }
      // 
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `${song.title}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);

      toast.success('Download started', { id: downloadToast });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download song. Please try again.', { id: downloadToast });
    }
  };

  const handleViewLessons = () => {
    router.push(`/dashboard/lessons?songId=${song.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          onClick={handleToggleFavorite}
          disabled={isFavoriting || isDisabled}
          className="w-full justify-start"
        >
          {isFavorite ? (
            <>
              <HeartOff className="h-4 w-4 mr-2" />
              Remove from Favorites
            </>
          ) : (
            <>
              <Heart className="h-4 w-4 mr-2" />
              Add to Favorites
            </>
          )}
        </Button>

        <Button 
          variant="outline" 
          onClick={handleViewLessons}
          disabled={isFavoriting || isDisabled}
          className="w-full justify-start"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          View in Lessons
        </Button>

        <Button 
          variant="outline" 
          onClick={handleShare}
          disabled={isFavoriting || isDisabled}
          className="w-full justify-start"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Song
        </Button>

        <Button 
          variant="outline" 
          onClick={handleDownload}
          disabled={isFavoriting || isDisabled}
          className="w-full justify-start"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardContent>
    </Card>
  );
} 