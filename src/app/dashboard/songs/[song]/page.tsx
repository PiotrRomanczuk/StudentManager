import { Link, ArrowLeft } from 'lucide-react';
import SongDetails from './@components/SongDetail';
import { isGuid } from '@/utils/isGuid';

export default async function Page({ params }: { params: { song: string } }) {
	const { song: slug } = await params;

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
		return (
			<div>
				<Link
					href='/dashboard/'
					className='flex items-center mb-6 text-blue-500 hover:text-blue-600'
				>
					<ArrowLeft className='mr-20' size={12} />
					Back to Songs
				</Link>
				Song not found
			</div>
		);
	}

	const song = await response.json();

	if (!song) {
		return (
			<div>
				<Link
					href='/dashboard/'
					className='flex items-center mb-6 text-blue-500 hover:text-blue-600'
				>
					<ArrowLeft className='mr-20' size={12} />
					Back to Songs
				</Link>
				Song not found
			</div>
		);
	}

	return (
		<div>
			<Link
				href='/dashboard/'
				className='flex items-center mb-6 text-blue-500 hover:text-blue-600'
			>
				<ArrowLeft className='mr-20' size={40} />
				Back to Songs
			</Link>

			<SongDetails song={song.data} />
		</div>
	);
}
