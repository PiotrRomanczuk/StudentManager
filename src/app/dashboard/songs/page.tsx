import { Container } from "@/components/ui/container";
import { ErrorComponent } from "./@components/ErrorComponent";
import { createClient } from "@/utils/supabase/clients/server";
import NoSongsFound from "./@components/NoSongsFound";
import SongsClientComponent from "./@components/SongsClientComponent";

export default async function Page() {
  const supabase = await createClient();
  const { data: songs, error } = await supabase.from("songs").select("*");

  if (error) {
    return (
      <ErrorComponent
        error={`Error loading songs: ${error}`}
        loadSongs={() => window.location.reload()}
      />
    );
  }

  if (!songs || songs.length === 0) {
    return <NoSongsFound />;
  }

  return (
    <div>
      <Container className="max-w-4xl">
        <div className="my-8">
          Songs
          <SongsClientComponent songs={songs} />
        </div>
      </Container>
    </div>
  );
}
