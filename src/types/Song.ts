export interface Song {
	Id: string;
	Title: string;
	Author: string;
	Level: 'beginner' | 'intermediate' | 'advanced';
	SongKey: string;
	Chords?: string;
	AudioFiles?: string;
	UltimateGuitarLink?: string;
	ShortTitle?: string;
	CreatedAt: string;
	UpdatedAt: string;
}

export type CreateSongDTO = Omit<Song, 'Id' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateSongDTO = Partial<CreateSongDTO>;
