# Song API Usage Guide

This guide shows how to use all the song API endpoints in your frontend application. The API provides comprehensive functionality for managing songs, including CRUD operations, search, favorites, bulk operations, and more.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Core CRUD Operations](#core-crud-operations)
3. [Search and Filtering](#search-and-filtering)
4. [Favorites Management](#favorites-management)
5. [Admin Operations](#admin-operations)
6. [Bulk Operations](#bulk-operations)
7. [Export and Statistics](#export-and-statistics)
8. [Student-Specific Operations](#student-specific-operations)
9. [Error Handling](#error-handling)
10. [React Hook Examples](#react-hook-examples)

## Basic Setup

First, import the song API helpers:

```typescript
import {
  getAllSongs,
  getUserSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  searchSongs,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  bulkImportSongs,
  exportSongs,
  getSongStats,
  handleSongApiError,
  type Song,
  type SongsResponse,
} from "@/utils/song-api-helpers";
```

## Core CRUD Operations

### 1. Get All Songs (Admin Only)

```typescript
// Get all songs with pagination and filters
const fetchAllSongs = async () => {
  try {
    const response = await getAllSongs({
      page: 1,
      limit: 20,
      level: "beginner",
      key: "C",
      author: "John Doe",
      search: "guitar",
      sortBy: "created_at",
      sortOrder: "desc",
    });

    console.log("Songs:", response.songs);
    console.log("Pagination:", response.pagination);
    console.log("Filters:", response.filters);
  } catch (error) {
    console.error("Error fetching songs:", handleSongApiError(error));
  }
};
```

### 2. Get User Songs

```typescript
// Get songs for current user or specific user
const fetchUserSongs = async (userId?: string) => {
  try {
    const response = await getUserSongs(userId);
    return response.songs;
  } catch (error) {
    console.error("Error fetching user songs:", handleSongApiError(error));
    return [];
  }
};
```

### 3. Get Single Song

```typescript
// Get a specific song by ID
const fetchSong = async (songId: string) => {
  try {
    const song = await getSongById(songId);
    return song;
  } catch (error) {
    console.error("Error fetching song:", handleSongApiError(error));
    return null;
  }
};
```

### 4. Create Song

```typescript
// Create a new song
const createNewSong = async (songData: Partial<Song>) => {
  try {
    const newSong = await createSong({
      title: "Wonderwall",
      author: "Oasis",
      level: "intermediate",
      key: "C",
      chords: "C G Am F",
      ultimate_guitar_link:
        "https://tabs.ultimate-guitar.com/o/oasis/wonderwall_tab.htm",
    });

    console.log("Song created:", newSong);
    return newSong;
  } catch (error) {
    console.error("Error creating song:", handleSongApiError(error));
    throw error;
  }
};
```

### 5. Update Song

```typescript
// Update an existing song
const updateExistingSong = async (songId: string, updates: Partial<Song>) => {
  try {
    const updatedSong = await updateSong(songId, {
      title: "Updated Title",
      level: "advanced",
      chords: "Updated chord progression",
    });

    console.log("Song updated:", updatedSong);
    return updatedSong;
  } catch (error) {
    console.error("Error updating song:", handleSongApiError(error));
    throw error;
  }
};
```

### 6. Delete Song

```typescript
// Delete a song
const deleteExistingSong = async (songId: string) => {
  try {
    const result = await deleteSong(songId);
    if (result.success) {
      console.log("Song deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting song:", handleSongApiError(error));
    throw error;
  }
};
```

## Search and Filtering

### Search Songs

```typescript
// Search songs with various filters
const searchSongsWithFilters = async () => {
  try {
    const response = await searchSongs({
      q: "guitar", // Search query
      level: "beginner",
      key: "C",
      author: "John Doe",
      hasAudio: true,
      hasChords: true,
      page: 1,
      limit: 20,
    });

    console.log("Search results:", response.songs);
    console.log("Total results:", response.pagination?.total);
  } catch (error) {
    console.error("Error searching songs:", handleSongApiError(error));
  }
};
```

## Favorites Management

### Get User Favorites

```typescript
// Get user's favorite songs
const fetchUserFavorites = async (userId: string) => {
  try {
    const response = await getUserFavorites(userId);
    console.log("Favorites:", response.favorites);
    console.log("Total favorites:", response.total);
    return response.favorites;
  } catch (error) {
    console.error("Error fetching favorites:", handleSongApiError(error));
    return [];
  }
};
```

### Add to Favorites

```typescript
// Add a song to favorites
const addSongToFavorites = async (userId: string, songId: string) => {
  try {
    const result = await addToFavorites(userId, songId);
    console.log("Added to favorites:", result);
    return result;
  } catch (error) {
    console.error("Error adding to favorites:", handleSongApiError(error));
    throw error;
  }
};
```

### Remove from Favorites

```typescript
// Remove a song from favorites
const removeSongFromFavorites = async (userId: string, songId: string) => {
  try {
    const result = await removeFromFavorites(userId, songId);
    if (result.success) {
      console.log("Removed from favorites successfully");
    }
  } catch (error) {
    console.error("Error removing from favorites:", handleSongApiError(error));
    throw error;
  }
};
```

## Admin Operations

### Get Admin Favorites

```typescript
// Get admin favorites (admin only)
const fetchAdminFavorites = async (userId: string) => {
  try {
    const favorites = await getAdminFavorites(userId);
    console.log("Admin favorites:", favorites);
    return favorites;
  } catch (error) {
    console.error("Error fetching admin favorites:", handleSongApiError(error));
    return [];
  }
};
```

### Get Admin User Songs

```typescript
// Get songs for a specific user (admin only)
const fetchAdminUserSongs = async (
  currentUserId: string,
  targetUserId: string
) => {
  try {
    const songs = await getAdminUserSongs(currentUserId, targetUserId);
    console.log("User songs:", songs);
    return songs;
  } catch (error) {
    console.error("Error fetching user songs:", handleSongApiError(error));
    return [];
  }
};
```

### Get Song Statistics

```typescript
// Get song statistics (admin only)
const fetchSongStats = async () => {
  try {
    const stats = await getSongStats();
    console.log("Total songs:", stats.total_songs);
    console.log("Songs by level:", stats.songs_by_level);
    console.log("Top authors:", stats.top_authors);
    return stats;
  } catch (error) {
    console.error("Error fetching stats:", handleSongApiError(error));
    return null;
  }
};
```

## Bulk Operations

### Bulk Import Songs

```typescript
// Import multiple songs at once
const importSongsBulk = async (songs: Partial<Song>[]) => {
  try {
    const result = await bulkImportSongs(songs, {
      overwrite: false,
      validate_only: false,
    });

    console.log("Import results:", result);
    return result;
  } catch (error) {
    console.error("Error importing songs:", handleSongApiError(error));
    throw error;
  }
};

// Validate songs without importing
const validateSongs = async (songs: Partial<Song>[]) => {
  try {
    const validation = await bulkImportSongs(songs, {
      validate_only: true,
    });

    console.log("Validation results:", validation);
    return validation;
  } catch (error) {
    console.error("Error validating songs:", handleSongApiError(error));
    throw error;
  }
};
```

### Bulk Delete Songs

```typescript
// Delete multiple songs (admin only)
const deleteSongsBulk = async (songIds: string[]) => {
  try {
    const result = await bulkDeleteSongs(songIds);
    console.log(`Deleted ${result.deleted_count} songs`);
    return result;
  } catch (error) {
    console.error("Error deleting songs:", handleSongApiError(error));
    throw error;
  }
};
```

## Export and Statistics

### Export Songs

```typescript
// Export songs in different formats
const exportSongsData = async () => {
  try {
    // Export as JSON
    const jsonResponse = await exportSongs({
      format: "json",
      level: "beginner",
      includeAudioUrls: true,
    });

    // Export as CSV
    const csvResponse = await exportSongs({
      format: "csv",
      author: "John Doe",
    });

    // Handle the response
    if (jsonResponse.ok) {
      const blob = await jsonResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "songs.json";
      a.click();
    }
  } catch (error) {
    console.error("Error exporting songs:", handleSongApiError(error));
  }
};
```

## Student-Specific Operations

### Get Student Songs

```typescript
// Get songs for a specific student
const fetchStudentSongs = async (studentId: string) => {
  try {
    const response = await getStudentSongs(studentId);
    console.log("Student songs:", response.songs);
    console.log("Total:", response.total);
    return response.songs;
  } catch (error) {
    console.error("Error fetching student songs:", handleSongApiError(error));
    return [];
  }
};
```

### Get User Test Songs

```typescript
// Get test songs for a user
const fetchUserTestSongs = async (userId: string) => {
  try {
    const songs = await getUserTestSongs(userId);
    console.log("Test songs:", songs);
    return songs;
  } catch (error) {
    console.error("Error fetching test songs:", handleSongApiError(error));
    return [];
  }
};
```

## Error Handling

The API helpers include comprehensive error handling:

```typescript
// Example of proper error handling
const handleSongOperation = async () => {
  try {
    const songs = await getAllSongs();
    return songs;
  } catch (error) {
    const errorMessage = handleSongApiError(error);

    // Handle specific error types
    if (error instanceof APIError) {
      switch (error.status) {
        case 401:
          // Redirect to login
          window.location.href = "/auth/signin";
          break;
        case 403:
          // Show permission denied message
          toast.error("You don't have permission to perform this action");
          break;
        case 404:
          // Show not found message
          toast.error("Song not found");
          break;
        default:
          // Show generic error
          toast.error(errorMessage);
      }
    }

    return null;
  }
};
```

## React Hook Examples

### Custom Hook for Songs

```typescript
import { useState, useEffect } from "react";
import { getAllSongs, type SongsResponse } from "@/utils/song-api-helpers";

export function useSongs(params?: {
  level?: string;
  key?: string;
  author?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const [songs, setSongs] = useState<SongsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllSongs(params);
        setSongs(data);
      } catch (err) {
        setError(handleSongApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [params]);

  return { songs, loading, error };
}
```

### Custom Hook for Favorites

```typescript
import { useState, useEffect } from "react";
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  type FavoritesResponse,
} from "@/utils/song-api-helpers";

export function useFavorites(userId: string) {
  const [favorites, setFavorites] = useState<FavoritesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserFavorites(userId);
      setFavorites(data);
    } catch (err) {
      setError(handleSongApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (songId: string) => {
    try {
      await addToFavorites(userId, songId);
      await fetchFavorites(); // Refresh the list
    } catch (err) {
      setError(handleSongApiError(err));
    }
  };

  const removeFavorite = async (songId: string) => {
    try {
      await removeFromFavorites(userId, songId);
      await fetchFavorites(); // Refresh the list
    } catch (err) {
      setError(handleSongApiError(err));
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    refetch: fetchFavorites,
  };
}
```

### Usage in Components

```typescript
// Example component using the hooks
function SongsList() {
  const { songs, loading, error } = useSongs({
    level: "beginner",
    limit: 20,
  });

  const { favorites, addFavorite, removeFavorite } = useFavorites("user123");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {songs?.songs.map((song) => (
        <div key={song.id}>
          <h3>{song.title}</h3>
          <p>{song.author}</p>
          <button onClick={() => addFavorite(song.id)}>Add to Favorites</button>
        </div>
      ))}
    </div>
  );
}
```

## Complete Example: Song Management Component

```typescript
import React, { useState, useEffect } from "react";
import {
  getAllSongs,
  createSong,
  updateSong,
  deleteSong,
  searchSongs,
  handleSongApiError,
  type Song,
} from "@/utils/song-api-helpers";

interface SongManagementProps {
  userId: string;
  isAdmin: boolean;
}

export function SongManagement({ userId, isAdmin }: SongManagementProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // Fetch songs
  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (isAdmin) {
        response = await getAllSongs({ limit: 50 });
      } else {
        response = await getUserSongs(userId);
      }

      setSongs(response.songs);
    } catch (err) {
      setError(handleSongApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Search songs
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await fetchSongs();
      return;
    }

    try {
      setLoading(true);
      const response = await searchSongs({ q: searchQuery, limit: 20 });
      setSongs(response.songs);
    } catch (err) {
      setError(handleSongApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Create song
  const handleCreateSong = async (songData: Partial<Song>) => {
    try {
      const newSong = await createSong(songData);
      setSongs((prev) => [newSong, ...prev]);
      setSelectedSong(null);
    } catch (err) {
      setError(handleSongApiError(err));
    }
  };

  // Update song
  const handleUpdateSong = async (songId: string, updates: Partial<Song>) => {
    try {
      const updatedSong = await updateSong(songId, updates);
      setSongs((prev) =>
        prev.map((song) => (song.id === songId ? updatedSong : song))
      );
      setSelectedSong(null);
    } catch (err) {
      setError(handleSongApiError(err));
    }
  };

  // Delete song
  const handleDeleteSong = async (songId: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      await deleteSong(songId);
      setSongs((prev) => prev.filter((song) => song.id !== songId));
    } catch (err) {
      setError(handleSongApiError(err));
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [userId, isAdmin]);

  if (loading) return <div>Loading songs...</div>;

  return (
    <div>
      {error && <div className="error">{error}</div>}

      {/* Search */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Songs List */}
      <div>
        {songs.map((song) => (
          <div key={song.id}>
            <h3>{song.title}</h3>
            <p>{song.author}</p>
            <button onClick={() => setSelectedSong(song)}>Edit</button>
            <button onClick={() => handleDeleteSong(song.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Song Form */}
      {selectedSong && (
        <SongForm
          song={selectedSong}
          onSubmit={(updates) => handleUpdateSong(selectedSong.id, updates)}
          onCancel={() => setSelectedSong(null)}
        />
      )}
    </div>
  );
}
```

This comprehensive guide covers all the song API endpoints and provides practical examples for using them in your frontend application. The helper functions handle authentication, error handling, and provide type safety for all operations.
