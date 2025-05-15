// import { useState } from 'react';
import { createClient } from "@/utils/supabase/clients/server";
import { ErrorComponent } from "./songs/@components/ErrorComponent";
import NoSongsFound from "./songs/@components/NoSongsFound";
// import { Lesson } from "@/types/Lesson";
import { fetchSongs } from "./@components/fetchSongs";
import { fetchUserAndAdmin } from "./@components/fetchUserAndAdmin";
import UserPage from "./@components/main/userPage";
import AdminPage from "./@components/main/adminPage";

export default async function Page() {
  const supabase = await createClient();

  try {
    const { user, userIsAdmin } = await fetchUserAndAdmin(supabase);

    if (!user?.user?.id) {
      return <ErrorComponent error="Please sign in to view your dashboard" />;
    }

    const songs = await fetchSongs(supabase, user.user.id, userIsAdmin.isAdmin);

    if (!songs?.length) {
      return <NoSongsFound />;
    }

    if (userIsAdmin.isAdmin) {
      return <AdminPage />;
    }

    return <UserPage songs={songs} />;
  } catch (error) {
    console.error("Dashboard error:", error);
    return <ErrorComponent error={(error as Error).message} />;
  }
}
