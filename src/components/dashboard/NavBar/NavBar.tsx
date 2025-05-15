'use client'

import UserInfo from "./UserInfo";
import { Music, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/dashboard/songs" label="Songs" />
            <NavItem href="/dashboard/playlists" label="Playlists" />
          </div>

          {/* User Info - Hidden on mobile */}
          <div className="hidden md:flex items-center">
            <UserInfo />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavItem href="/dashboard" label="Dashboard" />
            <MobileNavItem href="/dashboard/songs" label="Songs" />
            <MobileNavItem href="/dashboard/playlists" label="Playlists" />
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-2">
              <UserInfo />
            </div>
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

// Mobile navigation item component
const MobileNavItem = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-gray-700"
  >
    {label}
  </Link>
);

export default NavBar;
