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

  // Get user
  const { data: user, error: userIdError } = await supabase.auth.getUser();
  if (userIdError) {
    return <ErrorComponent error="Authentication error" />;
  }

  const { data: userIsAdmin, error: userIsAdminError } = await supabase
    .from("profiles")
    .select("isAdmin")
    .eq("user_id", user.user.id)
    .single();

  if (userIsAdminError) {
    return <ErrorComponent error="Error checking permissions" />;
  }

  // console.log("User is admin:", userIsAdmin);

  // Get lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .or(`student_id.eq.${user.user.id},teacher_id.eq.${user.user.id}`);

  // console.log("Lessons:", lessons);
  if (lessonsError) {
    return <ErrorComponent error="Error fetching lessons" />;
  }

  if (!lessons?.length) {
    return <NoSongsFound />;
  }

  // Get lesson songs
  const { data: lessonSongs, error: lessonSongsError } = await supabase
    .from("lesson_songs")
    .select("*")
    .in(
      "lesson_id",
      lessons.map((lesson: Lesson) => lesson.id),
    );

  if (lessonSongsError) {
    return <ErrorComponent error="Error fetching lesson songs" />;
  }

  // console.log("Lesson songs:", lessonSongs);

  if (!lessonSongs?.length) {
    return <NoSongsFound />;
  }

  // Fix the songs fetching logic
  let songs;
  let songsError;

  if (!userIsAdmin?.isAdmin) {
    // make a lint exception for any song.song_id
    const response = await supabase
    .from("songs")
    .select("*")
    .in(
      "id",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lessonSongs.map((song: Song) => song.id),
      );
    songs = response.data;
    songsError = response.error;
  } else {
    const response = await supabase.from("songs").select("*");
    songs = response.data;
    songsError = response.error;
  }

  // console.log("Songs:", songs);

  if (songsError) {
    return <ErrorComponent error="Error fetching songs" />;
  }

  if (!songs?.length) {
    return <NoSongsFound />;
  }
  // Sort songs by updated_at timestamp
  songs = songs.sort((a: Song, b: Song) => {
    const dateA = new Date(a.updated_at);
    const dateB = new Date(b.updated_at);
    return dateB.getTime() - dateA.getTime();
  });

  console.log("Songs:", songs);

  const { data: profiles, error: profilesError } = await supabase
  .from('profiles')
  .select('*');

  if (profilesError) {
    return <ErrorComponent error="Error fetching profiles" />;
  }

  return (
    <div>
      <Container className="max-w-4xl">
        <div className="my-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Songs</h1>
            {userIsAdmin?.isAdmin && (<>
              <Link
                href="/dashboard/songs/create"
                className="text-blue-500 hover:text-blue-600 font-bold"
              >
                Add New Song
              </Link>
              <SearchBar profiles={profiles} />
              </>)}
          </div>
          <SongsClientComponent songs={songs} />
        </div>
      </Container>
    </div>
  );
}
// const { data: songs, error } = await supabase.from("songs").select("*");

// const { data: user, error: userIdError } = await supabase.auth.getUser();

// console.log(user?.user?.id);
// if (userIdError) {
//   console.error("Error fetching user:", userIdError);
//   return <ErrorComponent error="Authentication error" />;
// }

// if (!user?.user?.id) {
//   console.error("No user ID found");
//   return <ErrorComponent error="Not authenticated" />;
// }

// const { data: userIsAdmin, error: userIsAdminError } = await supabase
//   .from("profiles")
//   .select("isAdmin")
//   .eq("user_id", user.user.id)
//   .single();

// if (userIsAdminError) {
//   console.error("Error fetching user admin status:", userIsAdminError);
//   return <ErrorComponent error="Error checking permissions" />;
// }

// console.log("User is admin:", userIsAdmin);

// const { data: lessons, error: lessonsError } = await supabase
//   .from("lessons")
//   .select("*")
//   .eq("student_id", user.user.id);

// if (lessonsError) {
//   console.error("Error fetching lessons:", lessonsError);
//   return <ErrorComponent error="Error fetching lessons" />;
// }

// const { data: lessonSongs, error: songsError } = await supabase
//   .from("lesson_songs")
//   .select("*")
//   .in("lesson_id", lessons?.map((lesson: any) => lesson.id) || []);

// console.log("Lesson songs:", lessonSongs);

// if (songsError) {
//   console.error("Error fetching songs:", songsError);
//   return <ErrorComponent error="Error fetching songs" />;
// }

// console.log("Lessons:", lessons);

// if (!songs || songs.length === 0) {
//   return <NoSongsFound />;
// }
