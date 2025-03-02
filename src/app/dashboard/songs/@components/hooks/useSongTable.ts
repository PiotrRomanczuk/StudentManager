import { useState, useMemo } from 'react';
import { Song } from '@/types/Song';
import { SortConfig, TableFilters } from '../types/tableTypes';

export function useSongTable(
	songs: Song[],
	currentPage: number,
	itemsPerPage: number
) {
	const [filters] = useState<TableFilters>({
		title: '',
		author: '',
		level: '',
		key: '',
	});

	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: null,
		direction: 'asc',
	});

	const handleSort = (key: keyof Song) => {
		setSortConfig((current) => ({
			key,
			direction:
				current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
		}));
	};

	const filteredAndSortedSongs = useMemo(() => {
		const result = songs.filter((song: Song) => {
			return (
				(song.title?.toLowerCase() || '').includes(
					filters.title.toLowerCase()
				) &&
				(song.author?.toLowerCase() || '').includes(
					filters.author.toLowerCase()
				) &&
				(song.level?.toString() || '').includes(filters.level) &&
				(song.key?.toLowerCase() || '').includes(filters.key.toLowerCase())
			);
		});

		if (sortConfig.key) {
			result.sort((a, b) => {
				const aValue = a[sortConfig.key!]?.toString().toLowerCase() || '';
				const bValue = b[sortConfig.key!]?.toString().toLowerCase() || '';

				if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
				if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
				return 0;
			});
		}

		return result;
	}, [songs, filters, sortConfig]);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentSongs = filteredAndSortedSongs.slice(startIndex, endIndex);

	const getSortIndicator = (key: keyof Song) => {
		if (sortConfig.key === key) {
			return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
		}
		return '';
	};

	return {
		currentSongs,
		handleSort,
		getSortIndicator,
	};
}
