"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSongApi } from "../hooks/useSongApi";
import { SongsTable } from "./SongsTable";
import { SimplePagination } from "./SimplePagination";
import { Song } from "@/types/Song";

interface TddSongsClientProps {
  userId: string;
  isAdmin: boolean;
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialLevel?: string;
  initialKey?: string;
  initialAuthor?: string;
  initialSortBy?: string;
  initialSortOrder?: string;
}

export default function TddSongsClient({ 
  userId, 
  isAdmin,
  initialPage = 1,
  initialLimit = 50,
  initialSearch = '',
  initialLevel = '',
  initialKey = '',
  initialAuthor = '',
  initialSortBy = 'created_at',
  initialSortOrder = 'desc'
}: TddSongsClientProps) {
  const searchParams = useSearchParams();
  
  const {
    songs,
    loading,
    error,
    fetchAllSongs,
    fetchUserSongs,
    pagination,
  } = useSongApi({ userId, isAdmin, autoFetch: false });

  // Get current URL parameters
  const getCurrentParams = useCallback(() => {
    const page = parseInt(searchParams.get('page') || initialPage.toString());
    const limit = parseInt(searchParams.get('limit') || initialLimit.toString());
    const search = searchParams.get('search') || initialSearch;
    const level = searchParams.get('level') || initialLevel;
    const key = searchParams.get('key') || initialKey;
    const author = searchParams.get('author') || initialAuthor;
    const sortBy = searchParams.get('sortBy') || initialSortBy;
    const sortOrder = (searchParams.get('sortOrder') || initialSortOrder) as 'asc' | 'desc';
    
    return { page, limit, search, level, key, author, sortBy, sortOrder };
  }, [searchParams, initialPage, initialLimit, initialSearch, initialLevel, initialKey, initialAuthor, initialSortBy, initialSortOrder]);

  // Fetch songs when URL parameters change
  useEffect(() => {
    const params = getCurrentParams();
    
    if (isAdmin) {
      fetchAllSongs({
        page: params.page,
        limit: params.limit,
        search: params.search,
        level: params.level || undefined,
        key: params.key || undefined,
        author: params.author || undefined,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      });
    } else {
      fetchUserSongs();
    }
  }, [searchParams, isAdmin, fetchAllSongs, fetchUserSongs, getCurrentParams]);

  const handleViewSong = (song: Song) => {
    console.log("View song:", song);
    // TODO: Navigate to song detail page
  };

  if (loading) {
    return <div>Loading songs...</div>;
  }

  if (error) {
    return <div>Error loading songs: {error}</div>;
  }

  const currentParams = getCurrentParams();

  return (
    <div className="space-y-4">
      <div>
        <h1>TDD Songs Table</h1>
        <p>User: {userId} | Admin: {isAdmin ? "Yes" : "No"}</p>
        <p>Total songs loaded: {songs.length} (Page {currentParams.page})</p>
        {pagination && (
          <p>Total songs in database: {pagination.total}</p>
        )}
      </div>

      <SongsTable 
        songs={songs} 
        onView={handleViewSong}
        // Remove client-side pagination since we're using server-side
        hidePagination={true}
      />

      {/* Simple pagination */}
      {isAdmin && pagination && (
        <SimplePagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
      )}
    </div>
  );
} 