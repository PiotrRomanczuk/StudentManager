export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Easy songs for new guitarists' },
  { value: 'intermediate', label: 'Intermediate', description: 'Moderate difficulty songs' },
  { value: 'advanced', label: 'Advanced', description: 'Complex songs for experienced players' },
];

export const MUSIC_KEYS = [
  { value: 'C', label: 'C Major' },
  { value: 'C#', label: 'C# Major' },
  { value: 'D', label: 'D Major' },
  { value: 'D#', label: 'D# Major' },
  { value: 'E', label: 'E Major' },
  { value: 'F', label: 'F Major' },
  { value: 'F#', label: 'F# Major' },
  { value: 'G', label: 'G Major' },
  { value: 'G#', label: 'G# Major' },
  { value: 'A', label: 'A Major' },
  { value: 'A#', label: 'A# Major' },
  { value: 'B', label: 'B Major' },
  { value: 'Cm', label: 'C Minor' },
  { value: 'C#m', label: 'C# Minor' },
  { value: 'Dm', label: 'D Minor' },
  { value: 'D#m', label: 'D# Minor' },
  { value: 'Em', label: 'E Minor' },
  { value: 'Fm', label: 'F Minor' },
  { value: 'F#m', label: 'F# Minor' },
  { value: 'Gm', label: 'G Minor' },
  { value: 'G#m', label: 'G# Minor' },
  { value: 'Am', label: 'A Minor' },
  { value: 'A#m', label: 'A# Minor' },
  { value: 'Bm', label: 'B Minor' },
];

export const FIELD_MAX_LENGTHS = {
  title: 200,
  author: 100,
  short_title: 50,
} as const; 