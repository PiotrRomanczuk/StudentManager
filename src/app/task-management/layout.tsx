import { createClient } from "@/utils/supabase/clients/server";
import { getUserAndAdmin } from "@/app/dashboard/utils/getUserAndAdmin";
import Dashboard from "@/app/dashboard/components/dashboard/Dashboard";
import NavBar from "@/components/dashboard/NavBar/NavBar";

export default async function TaskManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { isAdmin } = await getUserAndAdmin(supabase);

  return (
    <div className="w-full min-h-full">
      <NavBar />
      <div className="w-full min-h-full">
        <Dashboard isAdmin={isAdmin}>{children}</Dashboard>
      </div>
    </div>
  );
} 