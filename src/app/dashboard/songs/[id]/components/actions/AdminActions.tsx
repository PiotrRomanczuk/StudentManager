'use client';

import { Song } from '@/types/Song';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface AdminActionsProps {
  song: Song;
  isDisabled: boolean;
}

export function AdminActions({ song, isDisabled }: AdminActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/songs/${song.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this song? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const deleteToast = toast.loading('Deleting song...');

    try {
      // TODO: Implement delete functionality
      // const response = await fetch(`/api/songs/${song.id}`, {
      //   method: 'DELETE',
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to delete song');
      // }

      toast.success('Song deleted successfully', { id: deleteToast });
      router.push('/dashboard/songs');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete song. Please try again.', { id: deleteToast });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          onClick={handleEdit}
          disabled={isDeleting || isDisabled}
          className="w-full justify-start"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Song
        </Button>

        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={isDeleting || isDisabled}
          className="w-full justify-start"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Song
        </Button>
      </CardContent>
    </Card>
  );
} 