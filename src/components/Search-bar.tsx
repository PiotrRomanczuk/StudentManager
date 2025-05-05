'use client';

import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';

import { User } from '@/types/User';

export default function SearchBar({ profiles }: { profiles: User[] }) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const search = searchParams.get('user_id');

	const handleValueChange = (value: string) => {
		// Create a new URLSearchParams object
		const params = new URLSearchParams(searchParams.toString());
		params.set('user_id', value);

		// Update the URL with the new search param
		router.push(`?${params.toString()}`);
	};

	// URL -> `/dashboard?search=my-project`
	// `search` -> 'my-project'
	console.log(search);

	console.log(profiles);

	return (
		<Select
			onValueChange={handleValueChange}
			defaultValue={search || undefined}
		>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Users' />
			</SelectTrigger>
			<SelectContent>
				{profiles.map((profile: User) => (
					<SelectItem key={profile.user_id} value={profile.user_id}>
						{profile.email}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
