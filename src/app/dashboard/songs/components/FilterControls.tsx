'use client';

import { Filter } from 'lucide-react';
import { FilterSelect } from './FilterSelect';

interface FilterControlsProps {
	level: string;
	songKey: string;
	author: string;
	uniqueLevels: string[];
	uniqueKeys: string[];
	uniqueAuthors: string[];
	onLevelChange: (value: string) => void;
	onKeyChange: (value: string) => void;
	onAuthorChange: (value: string) => void;
}

export function FilterControls({
	level,
	songKey,
	author,
	uniqueLevels,
	uniqueKeys,
	uniqueAuthors,
	onLevelChange,
	onKeyChange,
	onAuthorChange,
}: FilterControlsProps) {
	return (
		<div className='flex flex-wrap gap-2'>
			<div className='flex items-center gap-2'>
				<Filter className='h-4 w-4 text-muted-foreground' />
				<span className='text-sm text-muted-foreground'>Filters:</span>
			</div>

			<FilterSelect
				value={level}
				onValueChange={onLevelChange}
				placeholder='Level'
				options={uniqueLevels}
			/>

			<FilterSelect
				value={songKey}
				onValueChange={onKeyChange}
				placeholder='Key'
				options={uniqueKeys}
			/>

			<FilterSelect
				value={author}
				onValueChange={onAuthorChange}
				placeholder='Author'
				options={uniqueAuthors}
				className='w-40'
			/>
		</div>
	);
}
