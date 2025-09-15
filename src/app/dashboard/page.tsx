
import { ErrorComponent } from "./@components/ErrorComponent";
import AdminPage from "./@components/main/adminPage";
import UserPage from "./@components/main/userPage";
import  NoSongsFound  from "./@components/NoSongsFound";
import { getUserAndAdminStatus } from "@/utils/auth-helpers";

import { BASE_URL } from "@/constants/BASE_URL";

export default async function Page() {
  try {
    const { user, isAdmin } = await getUserAndAdminStatus();

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
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Please sign in to view your dashboard";
    return <ErrorComponent error={errorMessage} />;
  }
}
