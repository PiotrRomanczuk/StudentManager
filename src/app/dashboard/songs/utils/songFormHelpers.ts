import { SongInput } from '@/schemas/SongSchema';
import { Song as SongType } from '@/types/Song';

// Valid enum values as const arrays
const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
const VALID_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'] as const;

type ValidLevel = typeof VALID_LEVELS[number];
type ValidKey = typeof VALID_KEYS[number];

// Helper function to safely convert song to form values
export function songToFormValues(song: SongType): Partial<SongInput> {
  return {
    title: song.title,
    author: song.author,
    level: VALID_LEVELS.includes(song.level as ValidLevel) ? (song.level as ValidLevel) : 'beginner',
    key: VALID_KEYS.includes(song.key as ValidKey) ? (song.key as ValidKey) : 'C',
    chords: song.chords || '',
    ultimate_guitar_link: song.ultimate_guitar_link || '',
    audio_files: song.audio_files ? JSON.parse(song.audio_files) : {},
    short_title: song.short_title || '',
  };
}

// Helper function to convert form values back to API format
export function formValuesToSongData(values: SongInput): Partial<SongType> {
  return {
    title: values.title,
    author: values.author,
    level: values.level,
    key: values.key,
    chords: values.chords,
    ultimate_guitar_link: values.ultimate_guitar_link?.trim() || undefined, // Convert empty string to undefined
    audio_files: JSON.stringify(values.audio_files || {}), // Send as JSON string
    short_title: values.short_title || undefined, // Convert empty string to undefined
  };
}

// Helper function to validate form values
export function validateFormValues(values: Partial<SongInput>): SongInput {
  return {
    title: values.title || '',
    author: values.author || '',
    level: VALID_LEVELS.includes(values.level as ValidLevel) ? (values.level as ValidLevel) : 'beginner',
    key: VALID_KEYS.includes(values.key as ValidKey) ? (values.key as ValidKey) : 'C',
    chords: values.chords || '',
    ultimate_guitar_link: values.ultimate_guitar_link || '',
    audio_files: values.audio_files || {},
    short_title: values.short_title || '',
  };
} 