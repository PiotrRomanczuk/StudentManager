"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DASHBOARD_LIST from "./SIDEBAR_LIST";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

/**
 * Sidebar component that handles the layout and navigation for the dashboard
 * @param children - The content to be rendered in the main area
 * @param isAdmin - Boolean flag indicating if the current user has admin privileges
 *
 * Admin Profile Check:
 * - The isAdmin prop should be set based on the user's role in your authentication system
 * - Example: isAdmin={user?.role === 'admin'} or isAdmin={user?.isAdmin}
 * - Only admin users will see restricted sections like Students, Assignments, etc.
 * - Regular users will only see basic sections like Sidebar, Songs, and Lessons
 */
const Sidebar = ({
  children,
  isAdmin = false,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter menu items based on admin status
  // This ensures that admin-only sections are only visible to users with admin privileges
  const filteredMenuItems = DASHBOARD_LIST.filter(
    (item) => !item.isAdmin || isAdmin,
  );

  return (
    <div className="flex min-h-full bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative z-50 w-64 md:w-64 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 min-h-full`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4 overflow-y-auto h-[calc(100%-4rem)]">
          {filteredMenuItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed bottom-4 right-4 md:hidden z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 p-4 md:p-8 min-h-full w-full bg-gray-100 ${
          isSidebarOpen ? "md:ml-4" : "md:ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
