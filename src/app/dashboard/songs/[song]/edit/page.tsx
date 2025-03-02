import SongEditClientForm from './SongEditClientForm';

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
	const resolvedParams = await params;
	const { slug } = resolvedParams;
	const songResponse = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/songs?title=${slug}`
	);
	const song = await songResponse.json();

	if (!song) {
		return <div>Song not found</div>;
	}

	return (
		<div>
			{song.data.Title}
			<SongEditClientForm song={song.data} />
		</div>
	);
}
