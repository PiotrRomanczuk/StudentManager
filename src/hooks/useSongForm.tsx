'use client';

import { useState } from 'react';
import { Song } from '@/types/Song';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { SongSchema } from '@/schemas/SongSchema';

interface UseSongFormProps {
	mode: 'create' | 'edit';
	songId?: string;
	initialData?: Song;
	onSuccess: () => void;
}

export default function useSongForm({
	mode,
	songId,
	initialData,
	onSuccess,
}: UseSongFormProps) {
	const form = useForm({
		resolver: zodResolver(SongSchema),
		defaultValues: initialData || {},
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (data: z.infer<typeof SongSchema>) => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(
				`/api/songs${mode === 'edit' ? `/${songId}` : ''}`,
				{
					method: mode === 'create' ? 'POST' : 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				}
			);

			if (!response.ok) throw new Error('Failed to save song');

			onSuccess();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('An unknown error occurred');
			}
		} finally {
			setLoading(false);
		}
	};

	return {
		form,
		loading,
		error,
		handleSubmit: form.handleSubmit((data) =>
			handleSubmit(data as unknown as z.infer<typeof SongSchema>)
		),
	};
}
