import { Song } from '@/types/Song';

export const normalizeSongData = (
	song: Partial<Song>,
	existingSong: Song
): Partial<Song> => {
	return {
		Id: existingSong.Id,
		Title: song.Title || existingSong.Title,
		Author: song.Author || existingSong.Author || '',
		Level: song.Level || existingSong.Level || '',
		Key: song.Key || existingSong.Key || 'Unknown',
		Chords: song.Chords || existingSong.Chords || '',
		AudioFiles: song.AudioFiles || '',
		UltimateGuitarLink: song.UltimateGuitarLink || '',
		ShortTitle: song.ShortTitle || '',
		CreatedAt: existingSong.CreatedAt,
		UpdatedAt: new Date().toISOString(),
	};
};
