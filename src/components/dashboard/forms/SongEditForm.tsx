'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Song } from '@/types/Song';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FORM_FIELDS = [
	{ id: 'title', label: 'Title', required: true },
	{ id: 'author', label: 'Author' },
	{ id: 'level', label: 'Level' },
	{ id: 'key', label: 'Key' },
	{ id: 'chords', label: 'Chords' },
	{ id: 'audio_files', label: 'Audio Files' },
	{ id: 'ultimate_guitar_link', label: 'Ultimate Guitar Link' },
	{ id: 'short_title', label: 'Short Title' },
];

export interface SongFormProps {
	mode: 'create' | 'edit';
	songId?: string;
	song?: Song;
	loading: boolean;
	error: string | null;
	onSubmit: (formData: Partial<Song>) => void;
	onCancel: () => void;
}

export function SongEditForm({
	mode,
	song,
	loading,
	error,
	onSubmit,
	onCancel,
}: SongFormProps) {
	//TODO: Use useForm hook to handle form state

	const [formData, setFormData] = useState<Partial<Song>>(song || {});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
		console.log(formData);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<Card className='w-full max-w-2xl mx-auto'>
			<CardHeader>
				<CardTitle>
					{mode === 'create' ? 'Create New Song' : 'Edit Song'}
				</CardTitle>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{FORM_FIELDS.map((field) => (
							<div key={field.id} className='space-y-2'>
								<Label htmlFor={field.id}>{field.label}</Label>
								<Input
									id={field.id}
									value={String(formData[field.id as keyof Song] || '')}
									onChange={handleInputChange}
								/>
							</div>
						))}
					</div>
					{error && (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
				</CardContent>
				<CardFooter className='flex justify-between'>
					<Button type='button' variant='outline' onClick={onCancel}>
						{mode === 'create' ? 'Back to Songs' : 'Back to Song'}
					</Button>
					<Button type='submit' disabled={loading}>
						{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						{loading
							? 'Saving...'
							: mode === 'create'
							? 'Create Song'
							: 'Update Song'}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
