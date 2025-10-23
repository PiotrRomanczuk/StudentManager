'use client';

import React, { useEffect, useState } from 'react';
import {
	getSongsForUser,
	SongsForUserResponse,
} from '../utils/getSongsForUser';
import { SongsTable } from './components/SongsTable';
import { PageHeader } from './components/PageHeader';

export default function SongsClientPage() {
	const [songsData, setSongsData] = useState<SongsForUserResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getSongsForUser({ page: 1, limit: 10 })
			.then((data) => {
				setSongsData(data);
				setError(null);
			})
			.catch((e) => {
				setError(e instanceof Error ? e.message : String(e));
				setSongsData(null);
			})
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className='p-4'>
			<PageHeader />
			{/* You may want to fetch user info separately if needed */}
			{/* <UserInfoCard user={user} isAdmin={false} /> */}
			<h2 className='text-xl font-bold mb-4'>
				Songs for Student (Client Side)
			</h2>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div className='text-red-500'>Error: {error}</div>
			) : songsData && songsData.songs && songsData.songs.length > 0 ? (
				<SongsTable songs={songsData.songs} />
			) : (
				<div>No songs found.</div>
			)}
		</div>
	);
}
