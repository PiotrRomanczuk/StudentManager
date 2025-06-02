import NavBar from "@/components/dashboard/NavBar/NavBar";
import Dashboard from "./@components/dashboard/Dashboard";
// import { UserProvider } from "@/context/userContext";

interface LayoutProps {
  children: React.ReactNode;
  components: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <UserProvider> */}
      <NavBar />
      <div className="w-full">
        <Dashboard>{children}</Dashboard>
      </div>
      {/* </UserProvider> */}
    </div>
  );
}
