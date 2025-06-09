const FORM_FIELDS = [
  {
    id: "title",
    label: "Title",
    required: true,
    placeholder: "Enter song title",
    type: "text",
  },
  {
    id: "author",
    label: "Author",
    placeholder: "Enter author name",
    type: "text",
  },
  {
    id: "level",
    label: "Level",
    placeholder: "Select difficulty level",
    type: "select",
    required: true,
  },
  {
    id: "key",
    label: "Key",
    placeholder: "Select musical key",
    type: "select",
  },
  {
    id: "ultimate_guitar_link",
    label: "Ultimate Guitar Link",
    placeholder: "Enter Ultimate Guitar URL",
    type: "text",
    required: true,
  },
  {
    id: "audio_files",
    label: "Audio Files",
    type: "file",
    accept: "audio/*",
  },
  {
    id: "chords",
    label: "Chords",
    placeholder: "Enter chord progression (e.g., Am G F E)",
    type: "textarea",
    fullWidth: true,
  },
];

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const MUSICAL_KEYS = [
  // C and C minor
  { value: "C", label: "C Major" },
  { value: "Cm", label: "C Minor" },
  // C# and C# minor
  { value: "C#", label: "C# Major" },
  { value: "C#m", label: "C# Minor" },
  // D and D minor
  { value: "D", label: "D Major" },
  { value: "Dm", label: "D Minor" },
  // D# and D# minor
  { value: "D#", label: "D# Major" },
  { value: "D#m", label: "D# Minor" },
  // E and E minor
  { value: "E", label: "E Major" },
  { value: "Em", label: "E Minor" },
  // F and F minor
  { value: "F", label: "F Major" },
  { value: "Fm", label: "F Minor" },
  // F# and F# minor
  { value: "F#", label: "F# Major" },
  { value: "F#m", label: "F# Minor" },
  // G and G minor
  { value: "G", label: "G Major" },
  { value: "Gm", label: "G Minor" },
  // G# and G# minor
  { value: "G#", label: "G# Major" },
  { value: "G#m", label: "G# Minor" },
  // A and A minor
  { value: "A", label: "A Major" },
  { value: "Am", label: "A Minor" },
  // A# and A# minor
  { value: "A#", label: "A# Major" },
  { value: "A#m", label: "A# Minor" },
  // B and B minor
  { value: "B", label: "B Major" },
  { value: "Bm", label: "B Minor" },
];

export { FORM_FIELDS, LEVEL_OPTIONS, MUSICAL_KEYS };
