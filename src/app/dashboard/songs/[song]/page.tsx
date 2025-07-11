import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SongDetails from "./@components/SongDetail";
import SongNotFound from "./@components/SongNotFound";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { cookies } from "next/headers";
import { BASE_URL } from "@/constants/BASE_URL";
import { getUserAndAdmin } from "@/app/dashboard/utils/getUserAndAdmin";
import { createClient } from "@/utils/supabase/clients/server";
import { fetchLessonsSong } from "./@components/FetchLessonsSong";
import { Song } from "@/types/Song";
import UsersWithSongList from "./@components/UsersWithSongList";

export default async function Page({
  params,
}: {
  params: Promise<{ song: string }>;
}) {
  const supabase = await createClient();
  const { song: songId } = await params;
  const cookieHeader = (await cookies()).toString();
  
  await getUserAndAdmin(supabase); // Keep the call for potential side effects

  let song: Song | null = null;
  let error: string | null = null;

  try {

    const res = await fetch(`${BASE_URL}/api/song/${songId}`, {
      cache: "no-store",
      headers: { Cookie: cookieHeader },
    });
    
    if (res.ok) {
      const songData = await res.json();
      if (songData && typeof songData === 'object' && 'title' in songData) {
        song = songData as Song;
  
      } else {
        error = 'Invalid song data received';
        console.error('Invalid song data:', songData);
      }
    } else {
      const errorData = await res.json().catch(() => ({}));
      error = `Status ${res.status}: ${errorData.error || 'Unknown error'}`;
      console.error(`Failed to fetch song: ${error}`);
    }
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : "Unknown error";
    console.error(`Error fetching song: ${error}`);
  }

  if (error) {
    return <ErrorComponent error={`Failed to fetch song: ${error}`} />;
  }

  if (!song) {
    
    return <SongNotFound />;
  }

  
  const { data: lessons, error: lessonsError } = await fetchLessonsSong(songId);
  
  if (lessonsError) {
    console.error(`Failed to fetch lessons: ${lessonsError.message}`);
    return <ErrorComponent error={`Failed to fetch lessons: ${lessonsError.message}`} />;
  }

  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/songs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Back to Songs</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <SongDetails song={song} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <UsersWithSongList lessons={lessons || []} />
        </div>
      </div>
    </div>
  );
}
