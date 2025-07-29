import { SongsTable } from "./components/SongsTable";
import { ServerSideFilters } from "./components/ServerSideFilters";
import { PaginationWrapper } from "./components/PaginationWrapper";
import { UserInfoCard } from "./components/UserInfoCard";
import { PageHeader } from "./components/PageHeader";
import { PaginationInfo } from "./components/PaginationInfo";
import { buildCookieHeader } from "./components/CookieHeaderBuilder";
import { parseSearchParams } from "./components/SearchParamsParser";
import { getUserAndAdminStatus } from "@/utils/auth-helpers";
import { getAllSongs } from "./song-api-helpers";

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

export default async function SongsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { user, isAdmin } = await getUserAndAdminStatus();
  const cookieHeader = await buildCookieHeader();
  const parsedParams = parseSearchParams(params);

  const { songs, pagination } = await getAllSongs({
    level: parsedParams.level,
    key: parsedParams.key,
    author: parsedParams.author,
    search: parsedParams.search,
    page: parsedParams.page,
    limit: parsedParams.limit,
    sortBy: parsedParams.sortBy,
    sortOrder: parsedParams.sortOrder,
    cookieHeader,
  });

  return (
    <div className="p-4">
      <PageHeader />
      <UserInfoCard user={user} isAdmin={isAdmin} />
      <ServerSideFilters songs={songs || []} filterOptions={undefined} />
      <SongsTable songs={songs || []} />
      {pagination && (
        <>
          <PaginationWrapper pagination={pagination} />
          <PaginationInfo pagination={pagination} />
        </>
      )}
    </div>
  );
}