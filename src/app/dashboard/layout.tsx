import NavBar from "@/components/dashboard/NavBar/NavBar";
import Dashboard from "./@components/dashboard/Dashboard";

interface LayoutProps {
  children: React.ReactNode;
  components: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <div>
      <NavBar />
      <Dashboard>{children}</Dashboard>
    </div>
  );
}
