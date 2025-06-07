import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SongDetails from "./@components/SongDetail";
import SongNotFound from "./@components/SongNotFound";
import { ErrorComponent } from "@/components/dashboard/ErrorComponent";
import { cookies } from "next/headers";
import { BASE_URL } from "@/constants/BASE_URL";

export default async function Page({
  params,
}: {
  params: Promise<{ song: string }>;
}) {
  const { song: songId } = await params;
  const cookieHeader = (await cookies()).toString();

  let song = null;
  let error = null;

  try {
    const res = await fetch(`${BASE_URL}/api/song/${songId}`, {
      cache: "no-store",
      headers: { Cookie: cookieHeader },
    });
    if (res.ok) {
      song = await res.json();
    } else {
      error = `Status ${res.status}`;
    }
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  if (error) {
    return <ErrorComponent error={`Failed to fetch song: ${error}`} />;
  }

  if (!song) {
    return <SongNotFound />;
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <SongDetails song={song} />
      </div>
    </div>
  );
}
