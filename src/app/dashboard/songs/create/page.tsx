import { createClient } from "@/utils/supabase/clients/server";
import SongCreateClientForm from "./SongCreateClientForm";

type Params = Promise<{ song: string }>;

export default async function Page({ params }: { params: Params }) {
  const { song: songId } = await params;

  const supabase = await createClient();

  const { data: song, error } = await supabase.from("songs").insert({
    title: "Unknown",
    author: "Unknown",
    level: "Beginner",
    key: "C",
    chords: [],
    audio_files: [],
    ultimate_guitar_link: "",
    short_title: "Unknown",
    created_at: new Date().toISOString(),
  });

  return (
    <div>
      <SongCreateClientForm song={song} />
    </div>
  );
}
