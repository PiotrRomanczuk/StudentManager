'use client';

import { Song } from '@/types/Song';
import { SongsTableDesktop } from './SongsTableDesktop';
import { SongsTableMobile } from './SongsTableMobile';
import { useState, useEffect } from 'react';

// Helper function to safely format dates
export const formatDate = (dateValue: Date | string): string => {
  if (dateValue instanceof Date) {
    return dateValue.toLocaleDateString();
  }
  if (typeof dateValue === 'string') {
    return new Date(dateValue).toLocaleDateString();
  }
  return 'Invalid date';
};

export type SortField = 'title' | 'author' | 'level' | 'key' | 'created_at' | 'updated_at';

interface SongsTableProps {
  songs: Song[];
}

export function SongsTable({ 
  songs
}: SongsTableProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-lg font-semibold text-muted-foreground">No songs found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          No songs are available yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {isMobile ? (
        <SongsTableMobile
          songs={songs}
        />
      ) : (
        <SongsTableDesktop
          songs={songs}
        />
      )}
    </div>
  );
} 