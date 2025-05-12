import { Song } from "@/types/Song";

export const normalizeSongData = (
  song: Partial<Song>,
  existingSong: Song,
): Partial<Song> => {
  return {
    id: existingSong.id,
    title: song.title || existingSong.title,
    author: song.author || existingSong.author || "",
    level: song.level || existingSong.level || "",
    key: song.key || existingSong.key || "Unknown",
    chords: song.chords || existingSong.chords || "",
    audio_files: song.audio_files || "",
    ultimate_guitar_link: song.ultimate_guitar_link || "",
    short_title: song.short_title || "",
    created_at: existingSong.created_at,
    updated_at: new Date(),
  };
};
