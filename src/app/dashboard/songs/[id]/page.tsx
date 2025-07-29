import { notFound } from "next/navigation";
import { getUserAndAdminStatus } from "@/utils/auth-helpers";
import { getSongById } from "../song-api-helpers";
import { cookies } from "next/headers";
import { SongDetails } from "./components/SongDetails";
import { SongActions } from "./components/SongActions";
import { SongHeader } from "./components/SongHeader";
import { AdminInfo } from "./components/AdminInfo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SongPage({ params }: PageProps) {
  const { id } = await params;
  const { isAdmin } = await getUserAndAdminStatus();

  // Get authentication cookies for server-side API calls
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  try {
    const song = await getSongById(id, cookieHeader);

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <SongHeader song={song} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <SongDetails song={song} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SongActions song={song} isAdmin={isAdmin} />
          </div>
        </div>

        {/* User Information (Admin Only) */}
        {isAdmin && <AdminInfo song={song} />}
      </div>
    );
  } catch (error) {
    console.error("Error fetching song:", error);
    
    // For any errors (like 404), show not found page
    notFound();
  }
} 