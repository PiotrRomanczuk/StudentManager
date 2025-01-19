import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/utils/api-helpers';
import { Song, CreateSongDTO } from '@/types/Song';

export function useSongs() {
	return useQuery<Song[]>({
		queryKey: ['songs'],
		queryFn: () => fetchApi('/api/songs'),
	});
}

export function useSong(id: string) {
	return useQuery<Song>({
		queryKey: ['songs', id],
		queryFn: () => fetchApi(`/api/songs/${id}`),
	});
}

export function useCreateSong() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateSongDTO) =>
			fetchApi('/api/songs', {
				method: 'POST',
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['songs'] });
		},
	});
}
