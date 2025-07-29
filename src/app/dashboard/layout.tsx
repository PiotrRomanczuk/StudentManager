import NavBar from "@/app/dashboard/@components/NavBar/NavBar";
import Sidebar from "./@components/sidebar/Sidebar";
import { getUserAndAdminStatus } from "@/utils/auth-helpers";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  const { isAdmin } = await getUserAndAdminStatus();

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
}
