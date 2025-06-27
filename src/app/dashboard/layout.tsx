import NavBar from "@/components/dashboard/NavBar/NavBar";
import Dashboard from "./components/dashboard/Dashboard";
import { getUserAndAdmin } from "./utils/getUserAndAdmin";
import { createClient } from "@/utils/supabase/clients/server";
// import { UserProvider } from "@/context/userContext";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  const supabase = await createClient();
  const { isAdmin } = await getUserAndAdmin(supabase);

  return (
    <div className="w-full min-h-full">
      {/* <UserProvider> */}
      <NavBar />
      <div className="w-full min-h-full">
        <Dashboard isAdmin={isAdmin}>{children}</Dashboard>
      </div>
      {/* </UserProvider> */}
    </div>
  );
}
