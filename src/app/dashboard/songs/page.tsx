import { Container } from "@/components/ui/container";
import { ErrorComponent } from "@/app/dashboard/@components/ErrorComponent";
// COMMENTED OUT: Old components
// import SongsClientComponent from "./@components/SongsClientComponent";
// import { AdminControls } from "./@components/AdminControls";
import { cookies } from "next/headers";
import { getUserAndAdmin } from "../utils/getUserAndAdmin";
import { createClient } from "@/utils/supabase/clients/server";
// COMMENTED OUT: Old API calls
// import { fetchSongsData } from "./api/fetchSongs";
// import { fetchProfilesData } from "./api/fetchProfiles";
// import { getSongsByStudent } from "./FetchStudentSongs";

// NEW: Enhanced components
import { EnhancedSongPage } from "./enhanced-page";

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

    // COMMENTED OUT: Old data fetching logic
    // // Fetch profiles first so they're available in both conditions
    // const { profiles } = await fetchProfilesData(cookieHeader);

    // if (user_id) {
    //   const songs = await getSongsByStudent(user_id);
    //   if (!songs) {
    //     throw new Error("Failed to fetch songs for student");
    //   }

    //   return (
    //     <Container className="max-w-3xl border">
    //       <div className="my-8">
    //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mx-8 mb-4">
    //           <h1 className="text-2xl x-4 font-bold">Songs</h1>
    //           {isAdmin && <AdminControls profiles={profiles} />}
    //         </div>
    //         <SongsClientComponent
    //           songs={songs}
    //           isAdmin={false}
    //         />
    //       </div>
    //     </Container>
    //   );
    // }

    // const { songs } = await fetchSongsData(user?.id, cookieHeader);

    // if (!songs) {
    //   throw new Error("Failed to fetch songs");
    // }

    // return (
    //   <Container className="max-w-3xl border">
    //     <div className="my-8">
    //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mx-8 mb-4">
    //         <h1 className="text-2xl x-4 font-bold">Songs</h1>
    //         {isAdmin && <AdminControls profiles={profiles} />}
    //       </div>
    //       <SongsClientComponent
    //         songs={songs}
    //         isAdmin={isAdmin}
    //       />
    //     </div>
    //   </Container>
    // );

    // NEW: Enhanced song page with all API integrations
    return (
      <Container className="max-w-7xl">
        <EnhancedSongPage
          userId={user?.id || ""}
          isAdmin={isAdmin}
          // Pass student-specific songs if user_id is provided
          initialSongs={user_id ? [] : []} // The enhanced component will handle student-specific fetching
        />
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
