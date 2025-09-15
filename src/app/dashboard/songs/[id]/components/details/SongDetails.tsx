'use client';

import { Song } from '@/types/Song';
import { SongBasicInfo } from '../display/SongBasicInfo';
import { SongChords } from './SongChords';
import { SongAudioFiles } from './SongAudioFiles';
import { SongComments } from './SongComments';
import { SongExternalLinks } from './SongExternalLinks';
import { SongStatus } from './SongStatus';

interface SongDetailsProps {
  song: Song;
}

export function SongDetails({ song }: SongDetailsProps) {
  return (
    <div className="space-y-6">
      <SongBasicInfo song={song} />
      <SongChords song={song} />
      <SongAudioFiles song={song} />
      <SongComments song={song} />
      <SongExternalLinks song={song} />
      <SongStatus song={song} />
    </div>
  );
} 