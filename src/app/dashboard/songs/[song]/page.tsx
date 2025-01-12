import SongDetails from './@components/SongDetail';

export default async function Page({ params }: { params: { song: string } }) {
	const { song: slug } = await params;
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/songs?title=${slug}`
	);
	const song = await response.json();

	return (
		<div>
			<SongDetails song={song.data} />
		</div>
	);
}
