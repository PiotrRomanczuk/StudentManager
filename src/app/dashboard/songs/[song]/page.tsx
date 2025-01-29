import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SongDetails from './@components/SongDetail';
import { isGuid } from '@/utils/isGuid';
import SongNotFound from './@components/SongNotFound';

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
	const { slug } = await params;

	let response;
	if (isGuid(slug)) {
		response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/songs/?id=${slug}`
		);
	} else {
		response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/songs?title=${slug}`
		);
	}

	if (!response.ok) {
		return <SongNotFound />;
	}

	const song = await response.json();

	if (!song) {
		return <SongNotFound />;
	}

	return (
		<>
			<div className='flex border border-black'>
				<Link
					href='/dashboard/'
					// className='flex items-center mb-6 text-blue-500 hover:text-blue-600'
				>
					<ArrowLeft size={28} />
					<div className='text-xl text-black'>Back to Songs</div>
				</Link>
			</div>
			<SongDetails song={song.data} />
		</>
	);
}
