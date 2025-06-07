import { Container } from "@/components/ui/container";
import { ErrorComponent } from "@/components/dashboard/ErrorComponent";
import SongsClientComponentTesting from "./@components/SongsClientComponentTesting";
import * as AdminControls from "../v1/@components/AdminControls";
import { cookies } from "next/headers";
import { getUserAndAdmin } from "../../@utils/getUserAndAdmin";
import { createClient } from "@/utils/supabase/clients/server";
import { fetchSongsData } from "./api/fetchSongs";
import { fetchProfilesData } from "./api/fetchProfiles";

export default async function SongsTestingPage() {
  try {
    const supabase = await createClient();
    const { user, isAdmin } = await getUserAndAdmin(supabase);
    const cookieHeader = (await cookies()).toString();

    const [{ songs, total }, { profiles }] = await Promise.all([
      fetchSongsData(user?.id, cookieHeader),
      fetchProfilesData(cookieHeader)
    ]);

    console.log('Server Debug:', { total, songsCount: songs.length })
    console.log('Songs:', songs)
    return (
      <Container className="max-w-3xl border">
        <div className="my-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mx-8 mb-4">
            <h1 className="text-2xl x-4 font-bold">Songs</h1>
            {isAdmin && <AdminControls.AdminControls profiles={profiles} />}
          </div>
          <SongsClientComponentTesting 
            songs={songs} 
            isAdmin={isAdmin} 
            totalItems={total}
          />
        </div>
      </Container>
    );
  } catch (error: unknown) {
    return (
      <ErrorComponent
        error={error instanceof Error ? error.message : "An error occurred"}
      />
    );
  }
}
