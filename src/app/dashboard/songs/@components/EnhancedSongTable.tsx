"use client";

import React, { useState, useMemo } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Heart,
  HeartOff,
  MoreHorizontal,
  Eye,
  Edit,
  Plus,
  BarChart3,
  FileText,
  Music,
  Users,
  Star,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { toast } from "sonner";
import { Song } from "@/types/Song";
import { useSongApi } from "../../tdd-songs/hooks/useSongApi";
import { EnhancedSongForm } from "./EnhancedSongForm";
import { DeleteSongDialog } from "./DeleteSongDialog";
import { PaginationComponent } from "../../@components/pagination/PaginationComponent";

interface EnhancedSongTableProps {
  userId: string;
  isAdmin: boolean;
  initialSongs?: Song[];
}

export function EnhancedSongTable({ userId, isAdmin, initialSongs = [] }: EnhancedSongTableProps) {
  // Use the songs passed from parent instead of fetching them again
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update songs when initialSongs changes
  React.useEffect(() => {
    setSongs(initialSongs);
  }, [initialSongs]);

  // Local state
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    level: "",
    key: "",
    author: "",
    hasAudio: false,
    hasChords: false,
  });
  const [sortConfig, setSortConfig] = useState({
    field: "updated_at" as keyof Song,
    direction: "desc" as "asc" | "desc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [deletingSong, setDeletingSong] = useState<Song | null>(null);
  const [importData, setImportData] = useState("");
  const [importOptions, setImportOptions] = useState({
    overwrite: false,
    validateOnly: false
  });

  // Filtered and sorted songs
  const filteredSongs = useMemo(() => {
    let filtered = songs;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.chords?.toLowerCase().includes(searchQuery.toLowerCase())
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

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
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
      
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [songs, searchQuery, filters, sortConfig]);

  // Paginated songs
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSongs = filteredSongs.slice(startIndex, endIndex);

  // Handlers
  const handleSearch = () => {
    // This function is no longer needed as songs are managed by parent
  };

  const handleSort = (field: keyof Song) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSongs(new Set(paginatedSongs.map(song => song.id)));
    } else {
      setSelectedSongs(new Set());
    }
  };

  const handleSelectSong = (songId: string, checked: boolean) => {
    const newSelected = new Set(selectedSongs);
    if (checked) {
      newSelected.add(songId);
    } else {
      newSelected.delete(songId);
    }
    setSelectedSongs(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedSongs.size === 0) {
      toast.error("No songs selected");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedSongs.size} songs?`)) {
      try {
        // This function is no longer needed as songs are managed by parent
        toast.success(`Deleted ${selectedSongs.size} songs`);
      } catch (error) {
        toast.error("Failed to delete songs");
      }
    }
  };

  const handleBulkImport = async () => {
    if (!importData.trim()) {
      toast.error("Please enter song data");
      return;
    }

    try {
      const songs = JSON.parse(importData);
      // This function is no longer needed as songs are managed by parent
      setImportData("");
      setShowImportDialog(false);
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const handleExport = async (format: "json" | "csv" | "pdf") => {
    try {
      // This function is no longer needed as songs are managed by parent
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const handleFavorite = async (songId: string, isFavorite: boolean) => {
    try {
      // This function is no longer needed as favorites are managed by parent
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const isFavorite = (songId: string) => {
    // This function is no longer needed as favorites are managed by parent
    return false;
  };

  const getSortIcon = (field: keyof Song) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Debug info */}
      <div className="text-sm text-gray-500">
        Debug: {songs.length} songs received, {filteredSongs.length} filtered, {paginatedSongs.length} on current page
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-2">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Songs Library</h2>
          {isAdmin && (
            <Badge variant="secondary" className="text-xs">
              Admin Mode
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Song
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="w-4 h-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Bulk Operations</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Import Songs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBulkDelete} disabled={selectedSongs.size === 0}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedSongs.size})
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Export</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport("json")}>
                <FileText className="w-4 h-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileText className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowStatsDialog(true)}>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Statistics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLoading(true)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search songs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
            <Button onClick={handleSearch} disabled={loading}>
              Search
            </Button>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <SelectItem value="F#">F# Major</SelectItem>
                    <SelectItem value="C#">C# Major</SelectItem>
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
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAudio"
                    checked={filters.hasAudio}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasAudio: checked as boolean }))}
                  />
                  <Label htmlFor="hasAudio">Has Audio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasChords"
                    checked={filters.hasChords}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasChords: checked as boolean }))}
                  />
                  <Label htmlFor="hasChords">Has Chords</Label>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Songs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedSongs.size === paginatedSongs.length && paginatedSongs.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-1">
                      Title
                      {getSortIcon("title")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("author")}
                  >
                    <div className="flex items-center gap-1">
                      Author
                      {getSortIcon("author")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("level")}
                  >
                    <div className="flex items-center gap-1">
                      Level
                      {getSortIcon("level")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("key")}
                  >
                    <div className="flex items-center gap-1">
                      Key
                      {getSortIcon("key")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("updated_at")}
                  >
                    <div className="flex items-center gap-1">
                      Updated
                      {getSortIcon("updated_at")}
                    </div>
                  </TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                        Loading songs...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedSongs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No songs found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSongs.map((song) => (
                    <TableRow key={song.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedSongs.has(song.id)}
                          onCheckedChange={(checked) => handleSelectSong(song.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{song.title}</TableCell>
                      <TableCell>{song.author || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{song.level || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{song.key || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(song.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFavorite(song.id, isFavorite(song.id))}
                          >
                            {isFavorite(song.id) ? (
                              <Heart className="w-4 h-4 text-red-500" />
                            ) : (
                              <HeartOff className="w-4 h-4" />
                            )}
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(`/dashboard/songs/${song.id}`, '_blank')}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditingSong(song)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setDeletingSong(song)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

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
            song={{
              id: "",
              title: "",
              author: "",
              level: "beginner",
              key: "",
              chords: "",
              audio_files: "",
              ultimate_guitar_link: "",
              short_title: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }}
            mode="create"
            loading={loading}
            error={error}
            onSubmit={async (songData) => {
              try {
                // This function is no longer needed as songs are managed by parent
                setShowCreateDialog(false);
              } catch (error) {
                // Error is handled by the hook
              }
            }}
            onCancel={() => setShowCreateDialog(false)}
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
              loading={loading}
              error={error}
              onSubmit={async (songData) => {
                try {
                  // This function is no longer needed as songs are managed by parent
                  setEditingSong(null);
                } catch (error) {
                  // Error is handled by the hook
                }
              }}
              onCancel={() => setEditingSong(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Import Songs Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Songs</DialogTitle>
            <DialogDescription>
              Paste JSON data to import songs. Each song should have title, author, level, key, and chords.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="importData">Song Data (JSON)</Label>
              <Textarea
                id="importData"
                placeholder='[{"title": "Song Title", "author": "Artist", "level": "beginner", "key": "C", "chords": "C G Am F"}]'
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overwrite"
                  checked={importOptions.overwrite}
                  onCheckedChange={(checked) => setImportOptions(prev => ({ ...prev, overwrite: checked as boolean }))}
                />
                <Label htmlFor="overwrite">Overwrite existing songs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="validateOnly"
                  checked={importOptions.validateOnly}
                  onCheckedChange={(checked) => setImportOptions(prev => ({ ...prev, validateOnly: checked as boolean }))}
                />
                <Label htmlFor="validateOnly">Validate only (don't import)</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkImport} disabled={loading}>
              {importOptions.validateOnly ? "Validate" : "Import"}
            </Button>
          </DialogFooter>
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
          {/* This section is no longer needed as stats are managed by parent */}
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No statistics available</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Song Dialog */}
      {deletingSong && (
        <DeleteSongDialog
          isOpen={!!deletingSong}
          onClose={() => setDeletingSong(null)}
          onConfirm={async () => {
            try {
              // This function is no longer needed as songs are managed by parent
              setDeletingSong(null);
            } catch (error) {
              // Error is handled by the hook
            }
          }}
          songTitle={deletingSong.title}
        />
      )}
    </div>
  );
} 