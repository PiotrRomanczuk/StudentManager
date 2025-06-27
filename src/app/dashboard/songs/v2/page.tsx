import { Container } from "@/components/ui/container";
import { ErrorComponent } from "@/components/dashboard/ErrorComponent";
import SongsClientComponentTesting from "./@components/SongsClientComponentTesting";
import { AdminControls } from "../v1/@components/AdminControls";
import { cookies } from "next/headers";
import { getUserAndAdmin } from "../../utils/getUserAndAdmin";
import { createClient } from "@/utils/supabase/clients/server";
import { fetchSongsData } from "./api/fetchSongs";
import { fetchProfilesData } from "./api/fetchProfiles";
import { getSongsByStudent } from "./FetchStudentSongs";

type Params = { user_id: string };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  try {
    const { user_id } = await searchParams;
    const supabase = await createClient();
    const { user, isAdmin } = await getUserAndAdmin(supabase);
    const cookieHeader = (await cookies()).toString();

    // Fetch profiles first so they're available in both conditions
    const { profiles } = await fetchProfilesData(cookieHeader);

    if (user_id) {
      const songs = await getSongsByStudent(user_id);
      if (!songs) {
        throw new Error("Failed to fetch songs for student");
      }

      return (
        <Container className="max-w-3xl border">
          <div className="my-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mx-8 mb-4">
              <h1 className="text-2xl x-4 font-bold">Songs</h1>
              {isAdmin && <AdminControls profiles={profiles} />}
            </div>
            <SongsClientComponentTesting
              songs={songs}
              isAdmin={false}
            />
          </div>
        </Container>
      );
    }

    const { songs } = await fetchSongsData(user?.id, cookieHeader);

    if (!songs) {
      throw new Error("Failed to fetch songs");
    }

    return (
      <Container className="max-w-3xl border">
        <div className="my-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mx-8 mb-4">
            <h1 className="text-2xl x-4 font-bold">Songs</h1>
            {isAdmin && <AdminControls profiles={profiles} />}
          </div>
          <SongsClientComponentTesting
            songs={songs}
            isAdmin={isAdmin}
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
