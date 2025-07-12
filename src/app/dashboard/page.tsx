import { ErrorComponent } from "./@components/ErrorComponent";
import NoSongsFound from "./@components/NoSongsFound";
import UserPage from "./@components/main/userPage";
import AdminPage from "./@components/main/adminPage";
import { getUserAndAdmin } from "./utils/getUserAndAdmin";
import { createClient } from "@/utils/supabase/clients/server";
import { BASE_URL } from "@/constants/BASE_URL";

export default async function Page() {
  const supabase = await createClient();
  let user, isAdmin;
  try {
    const result = await getUserAndAdmin(supabase);
    user = result.user;
    isAdmin = result.isAdmin;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Please sign in to view your dashboard";
    return <ErrorComponent error={errorMessage} />;
  }

  if (!user?.id) {
    return <ErrorComponent error="Please sign in to view your dashboard" />;
  }

  if (isAdmin) {
    return <AdminPage />;
  }

  // Fetch songs for the user from the API
  const response = await fetch(
    `${BASE_URL}/api/song/user-songs?userId=${user.id}`,
  );

  const data = await response.json();

  if (response.status !== 200) {
    return <ErrorComponent error={data.error || "Failed to fetch songs"} />;
  }

  const songs = data;

  if (!songs?.length) {
    return <NoSongsFound />;
  }

  return <UserPage songs={songs} />;
}
