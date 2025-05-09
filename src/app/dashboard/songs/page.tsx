import { Container } from "@/components/ui/container";
import { ErrorComponent } from "./@components/ErrorComponent";
import { createClient } from "@/utils/supabase/clients/server";
import NoSongsFound from "./@components/NoSongsFound";
import SongsClientComponent from "./@components/SongsClientComponent";
import Link from "next/link";
import SearchBar from "@/components/Search-bar";
import { fetchUserSongs, fetchAllProfiles } from "@/app/dashboard/songs/songService";

type Params = { user_id: string };

export default async function Page({ searchParams }: { searchParams: Promise<Params> }) {
  const { user_id } = await searchParams;
  const supabase = await createClient();

  // Fetch current user
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user?.user) return <ErrorComponent error="Authentication error" />;

  const userId = user.user.id;

  // Fetch user role
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", userId)
    .single();

  if (profileError) return <ErrorComponent error="Error checking permissions" />;

  const isAdmin = userProfile?.isAdmin;

  try {
    const { songs, lessonSongs } = await fetchUserSongs(userId, user_id);
    if (!songs?.length) return <NoSongsFound />;

    const profiles = await fetchAllProfiles();

    return (
      <div>
        <Container className="max-w-4xl">
          <div className="my-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Songs</h1>
              {isAdmin && (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard/songs/create"
                    className="text-blue-500 hover:text-blue-600 font-bold"
                  >
                    Add New Song
                  </Link>
                  <SearchBar profiles={profiles} />
                </div>
              )}
            </div>
            <SongsClientComponent songs={songs} />
          </div>
        </Container>
      </div>
    );
  } catch (error) {
    return <ErrorComponent error={error instanceof Error ? error.message : "An error occurred"} />;
  }
}
