// import { SongEditForm } from './@components/SongEditForm';

export default async function Page({ params }: { params: { song: string } }) {
	const { song: slug } = await params;
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/songs?title=${slug}`
	);
	const song = await response.json();

	return (
		<div>
			<h1 className='text-3xl font-bold mb-6'>{song.Title}</h1>
			{/* <SongEditForm
				song={song}
				mode='edit'
				// onSuccess={() => {
				// 	console.log('success');
				// }}
			/> */}
		</div>
	);
}
