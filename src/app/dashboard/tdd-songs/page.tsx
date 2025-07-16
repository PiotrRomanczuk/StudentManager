import { createClient } from "@/utils/supabase/clients/server";
import { getUserAndAdmin } from "@/app/dashboard/utils/getUserAndAdmin";
import TddSongsClient from "./components/TddSongsClient";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    level?: string;
    key?: string;
    author?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function TddSongsPage({ searchParams }: PageProps) {
  try {
    const supabase = await createClient();
    const { user, isAdmin } = await getUserAndAdmin(supabase);

    // Await searchParams before using them
    const params = await searchParams;

    // Parse search parameters
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '50');
    const search = params.search || '';
    const level = params.level || '';
    const key = params.key || '';
    const author = params.author || '';
    const sortBy = params.sortBy || 'created_at';
    const sortOrder = params.sortOrder || 'desc';

    return (
      <div>
        <TddSongsClient 
          userId={user?.id || ""} 
          isAdmin={isAdmin}
          initialPage={page}
          initialLimit={limit}
          initialSearch={search}
          initialLevel={level}
          initialKey={key}
          initialAuthor={author}
          initialSortBy={sortBy}
          initialSortOrder={sortOrder}
        />
      </div>
    );
  } catch {
    // Redirect to signin page if user is not authenticated
    redirect('/auth/signin');
  }
}