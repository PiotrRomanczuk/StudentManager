import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Song } from '@/types/Song';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
	Title: z.string().min(1, 'Title is required'),
	Author: z.string().min(1, 'Author is required'),
	Level: z.enum(['beginner', 'intermediate', 'advanced']),
	// ... other fields
});

type FormData = z.infer<typeof formSchema>;

interface SongFormProps {
	initialData?: Song;
	onSubmit: (data: FormData) => void;
}

export function SongForm({ initialData, onSubmit }: SongFormProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = form;

	const onSubmitForm = handleSubmit((data) => {
		onSubmit(data);
	});

	return (
		<form onSubmit={onSubmitForm} className='space-y-4'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div className='space-y-2'>
					<Label htmlFor='Title'>Title</Label>
					<Input
						id='Title'
						{...register('Title')}
						aria-invalid={!!errors.Title}
						aria-describedby={errors.Title ? 'title-error' : undefined}
					/>
					{errors.Title && (
						<span id='title-error' className='text-red-500 text-sm'>
							{errors.Title.message}
						</span>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='Author'>Author</Label>
					<Input
						id='Author'
						{...register('Author')}
						aria-invalid={!!errors.Author}
						aria-describedby={errors.Author ? 'author-error' : undefined}
					/>
					{errors.Author && (
						<span id='author-error' className='text-red-500 text-sm'>
							{errors.Author.message}
						</span>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='Level'>Level</Label>
					<Select {...register('Level')}>
						<option value='beginner'>Beginner</option>
						<option value='intermediate'>Intermediate</option>
						<option value='advanced'>Advanced</option>
					</Select>
					{errors.Level && (
						<span className='text-red-500 text-sm'>{errors.Level.message}</span>
					)}
				</div>
			</div>

			<div className='flex justify-end space-x-4'>
				<Button type='submit' disabled={isSubmitting}>
					{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
					{initialData ? 'Update Song' : 'Create Song'}
				</Button>
			</div>
		</form>
	);
}
