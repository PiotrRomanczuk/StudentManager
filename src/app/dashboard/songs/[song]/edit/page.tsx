import { createClient } from "@/utils/supabase/clients/server";
import SongEditClientForm from "./SongEditClientForm";

type Params = Promise<{ song: string }>;

export default async function Page({ params }: { params: Params }) {
  const resolvedParams = await params;
  const { song: songId } = resolvedParams;


  const supabase = await createClient();
  const { data: song, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", songId);

  if (error || !song) {
    return <div>Song not found</div>;
  }

  return (
    <div>
      <SongEditClientForm song={song[0]} />
    </div>
  );
}
