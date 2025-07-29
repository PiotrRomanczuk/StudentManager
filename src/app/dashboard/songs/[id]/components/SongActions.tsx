'use client';

import { Song } from '@/types/Song';
import { NavigationActions } from './NavigationActions';
import { QuickActions } from './QuickActions';
import { AdminActions } from './AdminActions';
import { SongMetadata } from './SongMetadata';

interface SongActionsProps {
  song: Song;
  isAdmin: boolean;
}

export function SongActions({ song, isAdmin }: SongActionsProps) {
  return (
    <div className="space-y-4">
      <NavigationActions />
      <QuickActions song={song} isDisabled={false} />
      {isAdmin && <AdminActions song={song} isDisabled={false} />}
      <SongMetadata song={song} />
    </div>
  );
} 