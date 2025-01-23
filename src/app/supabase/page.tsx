import { createClient } from '@/utils/supabase/server';

export default async function Page() {
	const supabase = await createClient();

	const { data: songs } = await supabase.from('songs').select();
	console.log(songs);

	return (
		<div>
			Hello
			<ul>
				{songs?.map((song) => (
					<li key={song.id}>{song.title}</li>
				))}
			</ul>
		</div>
	);
}
