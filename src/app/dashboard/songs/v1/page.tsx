import { Container } from "@/components/ui/container";
import { ErrorComponent } from "@/components/dashboard/ErrorComponent";
import SongsClientComponent from "../../components/dashboard/SongsClientComponent";
import * as AdminControls from "./@components/AdminControls";
import { cookies } from "next/headers";
import { getUserAndAdmin } from "../../utils/getUserAndAdmin";
import { createClient } from "@/utils/supabase/clients/server";
import { BASE_URL } from "@/constants/BASE_URL";

export default async function Page() {
  try {
    const supabase = await createClient();
    const { user, isAdmin } = await getUserAndAdmin(supabase);
    const cookieHeader = (await cookies()).toString();
    //
    const songs_res = await fetch(
      `${BASE_URL}/api/song/user-songs${user?.id ? `?userId=${user.id}` : ""}`,
      {
        cache: "no-store",
        // credentials: "include",
        headers: { Cookie: cookieHeader },
      },
    );
    if (!songs_res.ok) {
      return (
        <ErrorComponent
          error={(await songs_res.json()).error || "Failed to fetch songs"}
        />
      );
    }
    const { songs } = await songs_res.json();

    const profiles_res = await fetch(`${BASE_URL}/api/profiles`, {
      cache: "no-store",
      // credentials: "include",
      headers: { Cookie: cookieHeader },
    });
    if (!profiles_res.ok) {
      return (
        <ErrorComponent
          error={
            (await profiles_res.json()).error || "Failed to fetch profiles"
          }
        />
      );
    }
    const { profiles } = await profiles_res.json();

    return (
      <Container className="max-w-3xl border">
        <div className="my-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mx-8 mb-4">
            <h1 className="text-2xl x-4 font-bold">Songs</h1>
            {isAdmin && <AdminControls.AdminControls profiles={profiles} />}
          </div>
          <SongsClientComponent songs={songs} isAdmin={isAdmin} />
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
