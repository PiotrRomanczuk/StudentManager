import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SongDetails from "./@components/SongDetail";
import SongNotFound from "./@components/SongNotFound";
import { createClient } from "@/utils/supabase/clients/server";

type Params = Promise<{ song: string }>;

export default async function Page({ params }: { params: Params }) {
  const resolvedParams = await params;
  console.log("Resolved Params:", resolvedParams);
  const { song: songId } = resolvedParams;
  console.log("Song ID:", songId);

  const supabase = await createClient();

  const { data: song, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", songId)
    .single();

  console.log(song);
  if (error || !song) {
    return <SongNotFound />;
  }

  return (
    <>
      <div className="flex border border-black">
        <Link
          href="/dashboard/songs"
          className="flex items-center mb-6 text-blue-500 hover:text-blue-600"
        >
          <ArrowLeft size={28} />
          <div className="text-xl text-black">Back to Songs</div>
        </Link>
      </div>
      <SongDetails song={song} />
    </>
  );
}
