import { ErrorComponent } from "../@components/ErrorComponent";
import { LoadingState } from "@/components/ui/loading-state";
import { getUserAndAdminStatus } from "@/utils/auth-helpers";
import { 
  StudentsPageProps, 
  fetchProfiles, 
  StudentsCard, 
  EmptyState 
} from "./components";

export default async function Page({ searchParams }: StudentsPageProps) {
  const { sort, dir } = await searchParams;

  // Check if user is admin
  const { isAdmin } = await getUserAndAdminStatus();

  // Determine sort field and direction
  const sortField = sort || "email";
  const sortDir = dir === "desc" ? "desc" : "asc";

  // Fetch data
  const { data, error } = await fetchProfiles(sortField, sortDir);

  // Handle errors
  if (error) {
    let errorMsg = "Error loading profiles: ";
    if (error.message && error.message.includes("does not exist")) {
      errorMsg += `A column is missing in your database: ${error.message}`;
    } else {
      errorMsg += error.message || error.toString();
    }
    return <ErrorComponent error={errorMsg} />;
  }

  // Handle loading state
  if (!data) {
    return <LoadingState message="Loading students..." />;
  }

  // Handle empty state
  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <StudentsCard 
        data={data} 
        sortField={sortField} 
        sortDir={sortDir}
        isAdmin={isAdmin}
      />
    </div>
  );
}
