import { Container } from "@/components/ui/container";
import { ErrorComponent } from "./@components/ErrorComponent";
import { createClient } from "@/utils/supabase/clients/server";
import NoSongsFound from "./@components/NoSongsFound";
import SongsClientComponent from "./@components/SongsClientComponent";
import Link from "next/link";
import SearchBar from "@/components/Search-bar";
import {
  fetchUserSongs,
  fetchAllProfiles,
  fetchUserFavoriteSongsAsAdmin,
} from "@/app/dashboard/songs/songService";

type Params = { user_id: string };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const { user_id } = await searchParams;
  const supabase = await createClient();

  // Fetch current user
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user)
    return <ErrorComponent error="Authentication error" />;

  const userId = user.user.id;

  // Fetch user role
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", userId)
    .single();

  if (profileError)
    return <ErrorComponent error="Error checking permissions" />;

  const isAdmin = userProfile?.isAdmin;

  try {
    let songs;
    if (isAdmin && user_id) {
      songs = await fetchUserFavoriteSongsAsAdmin(userId, user_id);
    } else {
      const result = await fetchUserSongs(userId, user_id);
      songs = result.songs;
    }
    if (!songs?.length) return <NoSongsFound />;

    const profiles = await fetchAllProfiles();

    return (
      <div>
        <Container className="max-w-4xl">
          <div className="my-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold">Songs</h1>
              {isAdmin && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/dashboard/songs/create"
                    className="text-blue-500 hover:text-blue-600 font-bold whitespace-nowrap"
                  >
                    Add New Song
                  </Link>
                  <div className="w-full sm:w-auto">
                    <SearchBar profiles={profiles} />
                  </div>
                </div>
              )}
            </div>
            <SongsClientComponent songs={songs} />
          </div>
        </Container>
      </div>
    );
  } catch (error) {
    return (
      <ErrorComponent
        error={error instanceof Error ? error.message : "An error occurred"}
      />
    );
  }
}
