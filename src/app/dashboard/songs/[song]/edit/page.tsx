import SongEditClientForm from './SongEditClientForm';

export default async function Page({ params }: { params: { song: string } }) {
	const { song: slug } = await params;
	const songResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/songs?title=${slug}`
	);
	const song = await songResponse.json();

	if (!song) {
		return <div>Song not found</div>;
	}

	return (
		<div>
			<h1 className='text-3xl font-bold mb-6'>{song.data.Title}</h1>
			<SongEditClientForm song={song.data} />
		</div>
	);
}
