// import { useState } from 'react';
import { Container } from "@/components/ui/container";
import { LoadingComponent } from "./songs/@components/LoadingComponent";
import { ShortSongTable } from "./@components/cards/ShortSongTable";
import { createClient } from "@/utils/supabase/clients/server";

export default async function Page() {
  const supabase = await createClient();

  const { data: songs, error, loading } = await supabase.from("songs").select();

  if (loading) {
    return <LoadingComponent message="Loading songs..." />;
  }

  if (error) {
    throw new Error("Error loading songs:" + error);
  }

  if (songs.length === 0) {
    return <div>No songs found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="max-w-4xl py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Songs</h2>
          <ShortSongTable songs={songs} />
        </div>
      </Container>
    </div>
  );
}
