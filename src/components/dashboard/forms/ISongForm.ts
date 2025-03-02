import { Song } from "@/types/Song";

export interface SongFormProps {
  mode: "create" | "edit";
  songId?: string;
  song?: Song;
  loading: boolean;
  error: string | null;
  onSubmit: (formData: Partial<Song>) => void;
  onCancel: () => void;
}

export const FORM_FIELDS = [
  { id: "Title", label: "Title", required: true },
  { id: "Author", label: "Author" },
  { id: "Level", label: "Level" },
  { id: "Key", label: "Key" },
  { id: "Chords", label: "Chords" },
  { id: "AudioFiles", label: "Audio Files" },
  // { id: 'CreatedAt', label: 'Created At', required: true },
  { id: "UltimateGuitarLink", label: "Ultimate Guitar Link" },
  { id: "ShortTitle", label: "Short Title" },
];
