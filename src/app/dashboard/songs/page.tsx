'use client';

import { useState } from 'react';
import { Container } from '@/components/dashboard/ui/container';

import { LoadingComponent } from './@components/LoadingComponent';
import { ErrorComponent } from './@components/ErrorComponent';

import { SongTable } from './@components/SongTable';
import { PaginationComponent } from './@components/PaginationComponent';

import useLoadSongs from '@/hooks/useLoadSongs';

export default function Page() {
	const { loading, songs, error } = useLoadSongs();
	console.log(songs)
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;
	const totalPages = Math.ceil(songs.length / itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (loading) {
		return <LoadingComponent message='Loading songs...' />;
	}

	if (error) {
		return (
			<ErrorComponent
				error='Something wrong happened...'
				loadSongs={() => window.location.reload()}
			/>
		);
	}

	if (songs.length === 0) {
		return <div>No songs found</div>;
	}

	return (
		<div>
			<Container className='max-w-4xl'>
				<div className='my-8'>
					Songs
					<SongTable
						songs={songs}
						currentPage={currentPage}
						itemsPerPage={itemsPerPage}
						onPageChange={handlePageChange}
					/>
					{totalPages > 1 && (
						<PaginationComponent
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					)}
				</div>
			</Container>
		</div>
	);
}
