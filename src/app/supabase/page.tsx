import { Song } from '@/types/Song';
import { createClient } from '@/utils/supabase/clients/server';

export default async function Page() {
	const supabase = await createClient();

	const { data: songs } = await supabase.from('songs').select();
	console.log(songs);

	return (
		<div>
			Hello
			<ul>
				{songs?.map((song: Song) => (
					<li key={song.Id}>{song.Title}</li>
				))}
			</ul>
		</div>
	);
}
