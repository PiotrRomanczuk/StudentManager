import {
	SongsTable,
	ServerSideFilters,
	PaginationWrapper,
	UserInfoCard,
	PageHeader,
	PaginationInfo,
	buildCookieHeader,
	parseSearchParams,
} from './components';
import { getUserAndAdminStatus } from '@/utils/auth-helpers';
import { getAllSongs, getFilterOptions } from './@helpers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageProps {
	searchParams: Promise<{
		page?: string;
		limit?: string;
		search?: string;
		level?: string;
		key?: string;
		author?: string;
		sortBy?: string;
		sortOrder?: string;
	}>;
}

export default async function SongsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const { user, isAdmin } = await getUserAndAdminStatus();
	const cookieHeader = await buildCookieHeader();
	const parsedParams = parseSearchParams(params);

	const [{ songs, pagination }, filterOptions] = await Promise.all([
		getAllSongs({
			level: parsedParams.level,
			key: parsedParams.key,
			author: parsedParams.author,
			search: parsedParams.search,
			page: parsedParams.page,
			limit: parsedParams.limit,
			sortBy: parsedParams.sortBy,
			sortOrder: parsedParams.sortOrder,
			cookieHeader,
		}),
		getFilterOptions(cookieHeader),
	]);

	return (
		<div className='p-4 w-full'>
			<div className='w-full'>
				<div className='flex justify-between items-center mb-4'>
					<PageHeader />
					{isAdmin && (
						<Link href='/dashboard/songs/create'>
							<Button className='flex items-center gap-2'>
								<Plus className='h-4 w-4' />
								Create Song
							</Button>
						</Link>
					)}
				</div>
				<UserInfoCard user={user} isAdmin={isAdmin} />
				<ServerSideFilters songs={songs || []} filterOptions={filterOptions} />
				<SongsTable songs={songs || []} />
				{pagination && (
					<>
						<PaginationWrapper pagination={pagination} />
						<PaginationInfo pagination={pagination} />
					</>
				)}
			</div>
		</div>
	);
}
