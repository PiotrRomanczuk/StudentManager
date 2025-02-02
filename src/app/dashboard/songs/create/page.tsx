import SongCreateClientForm from './SongCreateClientForm';
import { Params } from '../{Types}/Params';

export default async function Page({ params }: { params: Params }) {
	const { slug } = await params;
	const songResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/songs?title=${slug}`
	);
	const song = await songResponse.json();

	if (!song) {
		return <div>Song not found</div>;
	}

	return (
		<div>
			<SongCreateClientForm song={song.data} />
		</div>
	);
}

// export default async function Page() {
// 	return <div>Create Song</div>;
// }
