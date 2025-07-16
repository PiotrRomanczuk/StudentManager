import NavBar from "@/app/dashboard/@components/NavBar/NavBar";
import Sidebar from "./@components/sidebar/Sidebar";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  try {
    const supabase = await createClient();
    const { isAdmin } = await getUserAndAdmin(supabase);

    return (
      <div className="w-full min-h-full">
        {/* <UserProvider> */}
        <NavBar />
        <div className="w-full min-h-full">
          <Sidebar isAdmin={isAdmin}>{children}</Sidebar>
        </div>
        {/* </UserProvider> */}
      </div>
    );
  } catch {
    // Redirect to signin page if user is not authenticated
    redirect('/auth/signin');
  }
}
