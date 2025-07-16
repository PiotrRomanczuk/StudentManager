"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  X,
  Music,
  User,
  Hash,
  Calendar,
  Star,
  Heart,
  Eye,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Settings,
  BookOpen,
  Mic,
  Guitar,
  BarChart3,
} from "lucide-react";
import { Song } from "@/types/Song";
import { useSongApi } from "../../tdd-songs/hooks/useSongApi";

interface AdvancedSongSearchProps {
  userId: string;
  isAdmin: boolean;
  onSongsChange?: (songs: Song[]) => void;
  showFavorites?: boolean;
  showStats?: boolean;
}

export function AdvancedSongSearch({ 
  userId, 
  isAdmin, 
  onSongsChange,
  showFavorites = true,
  showStats = true 
}: AdvancedSongSearchProps) {
  const {
    songs,
    favorites,
    stats,
    loading,
    error,
    searchSongsWithFilters,
    fetchUserFavorites,
    clearError
  } = useSongApi({ userId, isAdmin, autoFetch: false });

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"local" | "api">("local");
  const [filters, setFilters] = useState({
    level: "",
    key: "",
    author: "",
    hasAudio: false,
    hasChords: false,
    hasUltimateGuitar: false,
    dateRange: "",
    difficulty: "",
    genre: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Song>("updated_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Available tags for filtering
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    songs.forEach(song => {
      if (song.level) tags.add(song.level);
      if (song.key) tags.add(song.key);
      if (song.author) tags.add(song.author);
    });
    return Array.from(tags).sort();
  }, [songs]);

  // Filtered songs
  const filteredSongs = useMemo(() => {
    let filtered = songs;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.author?.toLowerCase().includes(query) ||
        song.chords?.toLowerCase().includes(query) ||
        song.short_title?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.level) {
      filtered = filtered.filter(song => song.level === filters.level);
    }
    if (filters.key) {
      filtered = filtered.filter(song => song.key === filters.key);
    }
    if (filters.author) {
      filtered = filtered.filter(song => song.author?.includes(filters.author));
    }
    if (filters.hasAudio) {
      filtered = filtered.filter(song => song.audio_files && song.audio_files.length > 0);
    }
    if (filters.hasChords) {
      filtered = filtered.filter(song => song.chords && song.chords.trim().length > 0);
    }
    if (filters.hasUltimateGuitar) {
      filtered = filtered.filter(song => song.ultimate_guitar_link && song.ultimate_guitar_link.length > 0);
    }

    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      const daysAgo = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      filtered = filtered.filter(song => new Date(song.updated_at) >= cutoffDate);
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      const difficultyOrder = { "beginner": 1, "intermediate": 2, "advanced": 3 };
      const targetDifficulty = difficultyOrder[filters.difficulty as keyof typeof difficultyOrder];
      filtered = filtered.filter(song => {
        const songDifficulty = difficultyOrder[song.level as keyof typeof difficultyOrder] || 0;
        return songDifficulty <= targetDifficulty;
      });
    }

    // Apply selected tags
    if (selectedTags.size > 0) {
      filtered = filtered.filter(song =>
        Array.from(selectedTags).some(tag =>
          song.level === tag ||
          song.key === tag ||
          song.author === tag
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [songs, searchQuery, filters, selectedTags, sortBy, sortOrder]);

  // Search handlers
  const handleSearch = () => {
    if (searchMode === "api") {
      searchSongsWithFilters({
        q: searchQuery,
        level: filters.level || undefined,
        key: filters.key || undefined,
        author: filters.author || undefined,
        hasAudio: filters.hasAudio || undefined,
        hasChords: filters.hasChords || undefined,
        page: 1,
        limit: 50
      });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({
      level: "",
      key: "",
      author: "",
      hasAudio: false,
      hasChords: false,
      hasUltimateGuitar: false,
      dateRange: "",
      difficulty: "",
      genre: "",
    });
    setSelectedTags(new Set());
  };

  const handleTagToggle = (tag: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tag)) {
      newSelected.delete(tag);
    } else {
      newSelected.add(tag);
    }
    setSelectedTags(newSelected);
  };

  // Notify parent of songs change
  useEffect(() => {
    onSongsChange?.(filteredSongs);
  }, [filteredSongs, onSongsChange]);

  // Load favorites on mount
  useEffect(() => {
    if (showFavorites) {
      fetchUserFavorites();
    }
  }, [showFavorites, fetchUserFavorites]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search songs by title, author, or chords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={searchMode} onValueChange={(value: "local" | "api") => setSearchMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showAdvancedFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
              
              <Button onClick={handleSearch} disabled={loading || searchMode === "local"}>
                {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showAdvancedFilters && (
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Basic Filters */}
              <div>
                <Label>Level</Label>
                <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Key</Label>
                <Select value={filters.key} onValueChange={(value) => setFilters(prev => ({ ...prev, key: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All keys" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All keys</SelectItem>
                    <SelectItem value="C">C Major</SelectItem>
                    <SelectItem value="G">G Major</SelectItem>
                    <SelectItem value="D">D Major</SelectItem>
                    <SelectItem value="A">A Major</SelectItem>
                    <SelectItem value="E">E Major</SelectItem>
                    <SelectItem value="B">B Major</SelectItem>
                    <SelectItem value="F">F Major</SelectItem>
                    <SelectItem value="Bb">Bb Major</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Author</Label>
                <Input
                  placeholder="Filter by author..."
                  value={filters.author}
                  onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Date Range</Label>
                <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All time</SelectItem>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Advanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Content Filters</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasAudio"
                      checked={filters.hasAudio}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasAudio: checked as boolean }))}
                    />
                    <Label htmlFor="hasAudio" className="text-sm">Has Audio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasChords"
                      checked={filters.hasChords}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasChords: checked as boolean }))}
                    />
                    <Label htmlFor="hasChords" className="text-sm">Has Chords</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasUltimateGuitar"
                      checked={filters.hasUltimateGuitar}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasUltimateGuitar: checked as boolean }))}
                    />
                    <Label htmlFor="hasUltimateGuitar" className="text-sm">Has Ultimate Guitar Link</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Difficulty</Label>
                <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any difficulty</SelectItem>
                    <SelectItem value="beginner">Beginner & below</SelectItem>
                    <SelectItem value="intermediate">Intermediate & below</SelectItem>
                    <SelectItem value="advanced">Advanced only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={(value: keyof Song) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="level">Level</SelectItem>
                    <SelectItem value="key">Key</SelectItem>
                    <SelectItem value="created_at">Created Date</SelectItem>
                    <SelectItem value="updated_at">Updated Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {filteredSongs.length} songs found
                </span>
                {(searchQuery || Object.values(filters).some(v => v !== "" && v !== false)) && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    <X className="w-3 h-3 mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.has(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {showStats && stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Library Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_songs}</div>
                <div className="text-sm text-gray-500">Total Songs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.songs_with_audio}</div>
                <div className="text-sm text-gray-500">With Audio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.songs_with_chords}</div>
                <div className="text-sm text-gray-500">With Chords</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.recent_songs}</div>
                <div className="text-sm text-gray-500">Recent (30d)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorites */}
      {showFavorites && favorites && favorites.favorites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Your Favorites ({favorites.favorites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.favorites.slice(0, 6).map(favorite => (
                <div key={favorite.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="font-medium">{favorite.song.title}</div>
                  <div className="text-sm text-gray-500">{favorite.song.author}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{favorite.song.level}</Badge>
                    <Badge variant="secondary" className="text-xs">{favorite.song.key}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 