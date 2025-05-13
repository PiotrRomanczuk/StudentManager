import UserInfo from "./UserInfo";
import { Music } from "lucide-react";
import Link from "next/link";

const NavBar: React.FC = async () => {
  return (
    <nav className="sticky top-0 z-50 w-full shadow-md backdrop-blur-lg bg-slate-900/80 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <Music className="h-6 w-6 text-indigo-400" />
              <span className="text-lg font-bold text-white">Songs Manager</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/dashboard/songs" label="Songs" />
            <NavItem href="/dashboard/playlists" label="Playlists" />
          </div>

          {/* User Info */}
          <div className="flex items-center">
            <UserInfo />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Reusable navigation item component
const NavItem = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="text-slate-300 hover:text-white transition-colors font-medium"
  >
    {label}
  </Link>
);

export default NavBar;
