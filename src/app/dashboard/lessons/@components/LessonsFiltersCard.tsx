import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LessonFilters } from './LessonFilters';

interface LessonsFiltersCardProps {
	currentSort: string;
	currentFilter: string | null;
	isAdmin: boolean;
	seasons?: string[];
	currentSeason?: string;
}

export function LessonsFiltersCard({
	currentSort,
	currentFilter,
	isAdmin,
	seasons = [],
	currentSeason = '',
}: LessonsFiltersCardProps) {
	return (
		<Card className='mb-6'>
			<CardHeader>
				<CardTitle className='text-lg'>Filters</CardTitle>
			</CardHeader>
			<CardContent>
				<Suspense fallback={<Skeleton className='h-10 w-80' />}>
					<LessonFilters
						currentSort={currentSort}
						currentFilter={currentFilter}
						isAdmin={isAdmin}
						seasons={seasons}
						currentSeason={currentSeason}
					/>
				</Suspense>
			</CardContent>
		</Card>
	);
}
