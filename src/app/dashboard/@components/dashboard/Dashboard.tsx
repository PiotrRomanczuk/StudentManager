"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DASHBOARD_LIST from "./DASHBOARD_LIST";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const Dashboard = ({ children }: { children: React.ReactNode }) => {
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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-100">
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
        } fixed md:relative z-50 w-64 md:w-64 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 h-full`}
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
          {DASHBOARD_LIST.map((item) => {
            const isActive = pathname === item.href;
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
        className={`flex-1 transition-all duration-300 p-4 md:p-8 h-full ${
          isSidebarOpen ? "md:ml-4" : "md:ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Dashboard;
