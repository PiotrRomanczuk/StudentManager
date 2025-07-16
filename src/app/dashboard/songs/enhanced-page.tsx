"use client";

import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Music,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Heart,
  Eye,
  Edit,
  Plus,
  BarChart3,
  FileText,
  Users,
  Star,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  BookOpen,
  Mic,
  Guitar,
  Hash,
  Calendar,
  User,
  ExternalLink,
  Link,
  Copy,
  Clipboard,
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  Info,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Song } from "@/types/Song";
import { useSongApi } from "../tdd-songs/hooks/useSongApi";
import { EnhancedSongTable } from "./@components/EnhancedSongTable";
import { AdvancedSongSearch } from "./@components/AdvancedSongSearch";
import { EnhancedSongForm } from "./@components/EnhancedSongForm";
import { SimpleSongTable } from "./@components/SimpleSongTable";
import { PaginationComponent } from "../@components/pagination/PaginationComponent";

interface EnhancedSongPageProps {
  userId: string;
  isAdmin: boolean;
  initialSongs?: Song[];
}

export function EnhancedSongPage({ userId, isAdmin, initialSongs = [] }: EnhancedSongPageProps) {
  const {
    songs,
    favorites,
    stats,
    loading,
    error,
    pagination,
    fetchAllSongs,
    fetchUserSongs,
    searchSongsWithFilters,
    createNewSong,
    updateExistingSong,
    deleteExistingSong,
    fetchUserFavorites,
    addSongToFavorites,
    removeSongFromFavorites,
    importSongsBulk,
    deleteSongsBulk,
    exportSongsData,
    fetchSongStats,
    refresh,
    clearError
  } = useSongApi({ userId, isAdmin, autoFetch: true });

  // Local state
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid" | "list">("table");
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [deletingSong, setDeletingSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    level: "",
    key: "",
    author: "",
    hasAudio: false,
    hasChords: false,
  });

  // Filtered songs based on active tab
  const filteredSongs = React.useMemo(() => {
    let filtered = songs;

    switch (activeTab) {
      case "favorites":
        filtered = favorites?.favorites.map(fav => fav.song) || [];
        break;
      case "recent":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(song => new Date(song.updated_at) >= thirtyDaysAgo);
        break;
      case "with-audio":
        filtered = filtered.filter(song => song.audio_files && song.audio_files.length > 0);
        break;
      case "with-chords":
        filtered = filtered.filter(song => song.chords && song.chords.trim().length > 0);
        break;
      case "beginner":
        filtered = filtered.filter(song => song.level === "beginner");
        break;
      case "intermediate":
        filtered = filtered.filter(song => song.level === "intermediate");
        break;
      case "advanced":
        filtered = filtered.filter(song => song.level === "advanced");
        break;
      default:
        // "all" - no filtering
        break;
    }

    return filtered;
  }, [songs, activeTab, favorites]);

  // Handlers
  const handleCreateSong = async (songData: Partial<Song>) => {
    try {
      await createNewSong(songData);
      setShowCreateDialog(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleUpdateSong = async (songId: string, updates: Partial<Song>) => {
    try {
      await updateExistingSong(songId, updates);
      setEditingSong(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      await deleteExistingSong(songId);
      setDeletingSong(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSongs.size === 0) {
      toast.error("No songs selected");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedSongs.size} songs?`)) {
      try {
        await deleteSongsBulk(Array.from(selectedSongs));
        setSelectedSongs(new Set());
        toast.success(`Deleted ${selectedSongs.size} songs`);
      } catch (error) {
        toast.error("Failed to delete songs");
      }
    }
  };

  const handleExport = async (format: "json" | "csv" | "pdf") => {
    try {
      await exportSongsData({
        format,
        level: filters.level || undefined,
        key: filters.key || undefined,
        author: filters.author || undefined,
        includeAudioUrls: true
      });
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const handleFavorite = async (songId: string, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        await removeSongFromFavorites(songId);
      } else {
        await addSongToFavorites(songId);
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const isFavorite = (songId: string) => {
    return favorites?.favorites.some(fav => fav.song_id === songId) || false;
  };

  return (
    <Container className="max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Songs Library</h1>
            <p className="text-gray-600 mt-1">
              {songs.length} songs • {favorites?.favorites.length || 0} favorites
              {isAdmin && ` • Admin mode`}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Song
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowStatsDialog(true)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Stats
            </Button>
            
            <Button
              variant="outline"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="ghost" size="sm" onClick={clearError} className="ml-2">
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="all">All Songs</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="with-audio">With Audio</TabsTrigger>
            <TabsTrigger value="with-chords">With Chords</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Search and Filters */}
            <AdvancedSongSearch
              userId={userId}
              isAdmin={isAdmin}
              onSongsChange={() => {}}
              showFavorites={false}
              showStats={false}
            />

            {/* View Mode Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {filteredSongs.length} songs
                </span>
                {selectedSongs.size > 0 && (
                  <Badge variant="secondary">
                    {selectedSongs.size} selected
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Songs Display */}
            {viewMode === "table" ? (
              <SimpleSongTable
                songs={filteredSongs}
                isAdmin={isAdmin}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSongs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    isFavorite={isFavorite(song.id)}
                    onFavorite={(isFavorite) => handleFavorite(song.id, isFavorite)}
                    onEdit={() => setEditingSong(song)}
                    onDelete={() => setDeletingSong(song)}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Song Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Song</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new song.
              </DialogDescription>
            </DialogHeader>
            <EnhancedSongForm
              mode="create"
              onSuccess={handleCreateSong}
              onCancel={() => setShowCreateDialog(false)}
              userId={userId}
              isAdmin={isAdmin}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Song Dialog */}
        <Dialog open={!!editingSong} onOpenChange={() => setEditingSong(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Song</DialogTitle>
              <DialogDescription>
                Update the song details below.
              </DialogDescription>
            </DialogHeader>
            {editingSong && (
              <EnhancedSongForm
                song={editingSong}
                mode="edit"
                onSuccess={(updatedSong) => handleUpdateSong(editingSong.id, updatedSong)}
                onCancel={() => setEditingSong(null)}
                userId={userId}
                isAdmin={isAdmin}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Statistics Dialog */}
        <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Song Statistics</DialogTitle>
              <DialogDescription>
                Overview of song library statistics.
              </DialogDescription>
            </DialogHeader>
            {stats ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard
                    title="Total Songs"
                    value={stats.total_songs}
                    icon={Music}
                    color="blue"
                  />
                  <StatCard
                    title="With Audio"
                    value={stats.songs_with_audio}
                    icon={Mic}
                    color="green"
                  />
                  <StatCard
                    title="With Chords"
                    value={stats.songs_with_chords}
                    icon={Guitar}
                    color="purple"
                  />
                  <StatCard
                    title="Recent (30d)"
                    value={stats.recent_songs}
                    icon={Calendar}
                    color="orange"
                  />
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Songs by Level</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.songs_by_level).map(([level, count]) => (
                      <div key={level} className="flex justify-between items-center">
                        <span className="capitalize">{level}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(count / stats.total_songs) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Top Authors</h4>
                  <div className="space-y-2">
                    {stats.top_authors.slice(0, 5).map(({ author, count }) => (
                      <div key={author} className="flex justify-between items-center">
                        <span className="truncate">{author}</span>
                        <Badge variant="secondary">{count} songs</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No statistics available</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
}

// Helper Components
function SongCard({ 
  song, 
  isFavorite, 
  onFavorite, 
  onEdit, 
  onDelete, 
  isAdmin 
}: {
  song: Song;
  isFavorite: boolean;
  onFavorite: (isFavorite: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{song.title}</h3>
            <p className="text-sm text-gray-500 truncate">{song.author}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFavorite(isFavorite)}
          >
            {isFavorite ? (
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            ) : (
              <Heart className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">{song.level}</Badge>
            <Badge variant="secondary" className="text-xs">{song.key}</Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(song.updated_at).toLocaleDateString()}</span>
            <div className="flex gap-1">
              {song.audio_files && <Mic className="w-3 h-3" />}
              {song.chords && <Guitar className="w-3 h-3" />}
              {song.ultimate_guitar_link && <Link className="w-3 h-3" />}
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex gap-1 pt-2">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
  };

  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </CardContent>
    </Card>
  );
} 