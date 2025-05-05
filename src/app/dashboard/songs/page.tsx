import { Container } from "@/components/ui/container";
import { ErrorComponent } from "./@components/ErrorComponent";
import { createClient } from "@/utils/supabase/clients/server";
import NoSongsFound from "./@components/NoSongsFound";
import SongsClientComponent from "./@components/SongsClientComponent";
import Link from "next/link";
import { Lesson } from "@/types/Lesson";
import { Song } from "@/types/Song";
import SearchBar from "@/components/Search-bar";

export default async function Page() {
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

  // Fetch lessons where user is either student or teacher
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .or(`student_id.eq.${userId},teacher_id.eq.${userId}`);

  if (lessonsError) return <ErrorComponent error="Error fetching lessons" />;
  if (!lessons?.length) return <NoSongsFound />;

  const lessonIds = lessons.map((lesson: Lesson) => lesson.id);

  // Fetch lesson songs
  const { data: lessonSongs, error: lessonSongsError } = await supabase
    .from("lesson_songs")
    .select("*")
    .in("lesson_id", lessonIds);

  if (lessonSongsError) return <ErrorComponent error="Error fetching lesson songs" />;
  if (!lessonSongs?.length) return <NoSongsFound />;

  // Fetch songs
  let songs: Song[] | null = [];
  let songsError;

  if (isAdmin) {
    const res = await supabase.from("songs").select("*");
    songs = res.data;
    songsError = res.error;
  } else {
    const songIds = lessonSongs.map((song: { song_id: string }) => song.song_id);
    const res = await supabase.from("songs").select("*").in("id", songIds);
    songs = res.data;
    songsError = res.error;
  }

  if (songsError) return <ErrorComponent error="Error fetching songs" />;
  if (!songs?.length) return <NoSongsFound />;

  // Sort songs by updated_at
  songs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  // Fetch all profiles (for admin search)
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*");

  if (profilesError) return <ErrorComponent error="Error fetching profiles" />;

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
}
