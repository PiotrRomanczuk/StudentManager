import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SongEditClientForm from "./SongEditClientForm";
import { createClient } from "@/utils/supabase/clients/server";

type Params = Promise<{ song: string }>;

export default async function EditPage({ params }: { params: Params }) {
  const resolvedParams = await params;

  const { song: songId } = resolvedParams;


  const supabase = await createClient();

  const { data: song, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", songId)
    .single();

  
  if (error || !song) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Song not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/songs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Songs</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Song</h1>
        <SongEditClientForm song={song} mode="edit" />
      </div>
    </div>
  );
}
