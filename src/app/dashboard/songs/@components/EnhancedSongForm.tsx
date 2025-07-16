"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Upload,
  Music,
  Link,
  FileText,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  ExternalLink,
  Download,
  Play,
  Pause,
  Volume2,
  Mic,
  Guitar,
  Hash,
  Calendar,
  User,
  Star,
  Heart,
  Eye,
  Edit,
  Trash2,
  Plus,
  Minus,
  Copy,
  Clipboard,
  Search,
  Filter,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Song } from "@/types/Song";
import { useSongApi } from "../../tdd-songs/hooks/useSongApi";
import { LEVEL_OPTIONS, MUSICAL_KEYS } from "../CONSTANTS";
import { Badge } from "@/components/ui/badge";

interface EnhancedSongFormProps {
  song?: Partial<Song>;
  mode: "create" | "edit";
  onSuccess?: (song: Song) => void;
  onCancel?: () => void;
  userId: string;
  isAdmin: boolean;
}

export function EnhancedSongForm({ 
  song, 
  mode, 
  onSuccess, 
  onCancel,
  userId,
  isAdmin 
}: EnhancedSongFormProps) {
  const {
    createNewSong,
    updateExistingSong,
    loading,
    error,
    clearError
  } = useSongApi({ userId, isAdmin, autoFetch: false });

  // Form state
  const [formData, setFormData] = useState<Partial<Song>>({
    title: "",
    author: "",
    level: "beginner",
    key: "",
    chords: "",
    audio_files: "",
    ultimate_guitar_link: "",
    short_title: "",
    ...song
  });

  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.ultimate_guitar_link?.trim()) {
      errors.ultimate_guitar_link = "Ultimate Guitar link is required";
    } else if (!isValidUrl(formData.ultimate_guitar_link)) {
      errors.ultimate_guitar_link = "Please enter a valid URL";
    }

    if (formData.short_title && formData.short_title.length > 50) {
      errors.short_title = "Short title must be less than 50 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Form handlers
  const handleInputChange = (field: keyof Song, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      if (mode === "create") {
        const newSong = await createNewSong(formData);
        toast.success(`Song "${newSong.title}" created successfully`);
        onSuccess?.(newSong);
      } else if (song?.id) {
        const updatedSong = await updateExistingSong(song.id, formData);
        toast.success(`Song "${updatedSong.title}" updated successfully`);
        onSuccess?.(updatedSong);
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Here you would actually upload the files to your storage service
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({ 
        ...prev, 
        audio_files: fileUrls.join(',') 
      }));

      toast.success(`${files.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('chords') || text.includes('C G Am F')) {
        setFormData(prev => ({ ...prev, chords: text }));
        toast.success("Chords pasted from clipboard");
      } else {
        toast.info("No chord data found in clipboard");
      }
    } catch (error) {
      toast.error("Failed to read from clipboard");
    }
  };

  const handleAutoGenerateShortTitle = () => {
    if (formData.title) {
      const shortTitle = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30);
      setFormData(prev => ({ ...prev, short_title: shortTitle }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="ghost" size="sm" onClick={clearError} className="ml-2">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="flex items-center gap-1">
                  Title *
                  {validationErrors.title && <AlertCircle className="w-4 h-4 text-red-500" />}
                </Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter song title"
                  className={validationErrors.title ? "border-red-500" : ""}
                />
                {validationErrors.title && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author || ""}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Enter author name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="level">Level *</Label>
                <Select 
                  value={formData.level || "beginner"} 
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVEL_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="key">Key</Label>
                <Select 
                  value={formData.key || ""} 
                  onValueChange={(value) => handleInputChange("key", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    {MUSICAL_KEYS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="short_title">Short Title</Label>
                <div className="flex gap-2">
                  <Input
                    id="short_title"
                    value={formData.short_title || ""}
                    onChange={(e) => handleInputChange("short_title", e.target.value)}
                    placeholder="Auto-generated"
                    maxLength={50}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoGenerateShortTitle}
                    disabled={!formData.title}
                  >
                    Auto
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Song Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="chords" className="flex items-center gap-2">
                Chords & Notes
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handlePasteFromClipboard}
                >
                  <Clipboard className="w-4 h-4 mr-1" />
                  Paste
                </Button>
              </Label>
              <Textarea
                id="chords"
                value={formData.chords || ""}
                onChange={(e) => handleInputChange("chords", e.target.value)}
                placeholder="Enter chord progression (e.g., C G Am F) or paste from clipboard"
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="ultimate_guitar_link" className="flex items-center gap-1">
                Ultimate Guitar Link *
                {validationErrors.ultimate_guitar_link && <AlertCircle className="w-4 h-4 text-red-500" />}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="ultimate_guitar_link"
                  value={formData.ultimate_guitar_link || ""}
                  onChange={(e) => handleInputChange("ultimate_guitar_link", e.target.value)}
                  placeholder="https://tabs.ultimate-guitar.com/..."
                  className={validationErrors.ultimate_guitar_link ? "border-red-500" : ""}
                />
                {formData.ultimate_guitar_link && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(formData.ultimate_guitar_link, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {validationErrors.ultimate_guitar_link && (
                <p className="text-sm text-red-500 mt-1">{validationErrors.ultimate_guitar_link}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Audio Files */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Audio Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-4" />
              <Label htmlFor="audio-files" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Click to upload audio files
                </span>
                <span className="text-gray-500 text-sm block mt-1">
                  or drag and drop MP3, WAV files
                </span>
              </Label>
              <Input
                id="audio-files"
                type="file"
                multiple
                accept="audio/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {formData.audio_files && (
              <div className="space-y-2">
                <Label>Uploaded Files</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Music className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{formData.audio_files}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, audio_files: "" }))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Advanced Options */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Advanced Options
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          
          {showAdvanced && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Difficulty Rating</Label>
                  <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <Button
                        key={rating}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        {rating}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Genre</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="folk">Folk</SelectItem>
                      <SelectItem value="blues">Blues</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="country">Country</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <Input placeholder="Enter tags separated by commas" />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea placeholder="Additional notes about the song..." />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
            </div>
          </CardHeader>
          
          {showPreview && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{formData.title || "Untitled Song"}</h3>
                  <p className="text-gray-600">{formData.author || "Unknown Artist"}</p>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="outline">{formData.level || "N/A"}</Badge>
                  <Badge variant="secondary">{formData.key || "N/A"}</Badge>
                </div>
                
                {formData.chords && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="text-sm font-medium">Chords</Label>
                    <pre className="text-sm font-mono mt-2 whitespace-pre-wrap">{formData.chords}</pre>
                  </div>
                )}
                
                {formData.ultimate_guitar_link && (
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    <a 
                      href={formData.ultimate_guitar_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View on Ultimate Guitar
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === "create" ? "Create Song" : "Update Song"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 