"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSongApi } from "../hooks/useSongApi";
import { SongsTable } from "./SongsTable";
import { SimplePagination } from "./SimplePagination";
import { ServerSideSearch } from "./ServerSideSearch";
import { Song } from "@/types/Song";

interface SongsClientProps {
  userId: string;
  isAdmin: boolean;
  initialSongs?: Song[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialLevel?: string;
  initialKey?: string;
  initialAuthor?: string;
  initialSortBy?: string;
  initialSortOrder?: string;
}

export default function SongsClient({ 
  userId, 
  isAdmin,
  initialSongs = [],
  initialPagination = null,
  initialPage = 1,
  initialLimit = 50,
  initialSearch = '',
  initialLevel = '',
  initialKey = '',
  initialAuthor = '',
  initialSortBy = 'created_at',
  initialSortOrder = 'desc'
}: SongsClientProps) {
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

  // Use initial data if available, otherwise fetch from API
  const currentSongs = initialSongs.length > 0 ? initialSongs : songs;
  const currentPagination = initialPagination || pagination;

  // Only fetch if we don't have initial data and URL parameters have changed
  useEffect(() => {
    if (initialSongs.length === 0) {
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
    }
  }, [searchParams, isAdmin, fetchAllSongs, fetchUserSongs, getCurrentParams, initialSongs.length]);



  if (loading && initialSongs.length === 0) {
    return <div>Loading songs...</div>;
  }

  if (error && initialSongs.length === 0) {
    return <div>Error loading songs: {error}</div>;
  }

  const currentParams = getCurrentParams();

  return (
    <div className="space-y-4">
      <div>
        <h1>TDD Songs Table</h1>
        <p>User: {userId} | Admin: {isAdmin ? "Yes" : "No"}</p>
        <p>Total songs loaded: {currentSongs.length} (Page {currentParams.page})</p>
        {currentPagination && (
          <p>Total songs in database: {currentPagination.total}</p>
        )}
      </div>

      {/* Server-side search and filters */}
      {isAdmin && (
        <ServerSideSearch songs={currentSongs} />
      )}

      <SongsTable 
        songs={currentSongs} 
      />

      {/* Simple pagination */}
      {isAdmin && currentPagination && (
        <SimplePagination
          currentPage={currentPagination.page}
          totalPages={currentPagination.totalPages}
          totalItems={currentPagination.total}
          itemsPerPage={currentPagination.limit}
        />
      )}
    </div>
  );
} 