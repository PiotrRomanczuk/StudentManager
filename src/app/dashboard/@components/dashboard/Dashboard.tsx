'use client'

import { useState } from 'react'
import Link from 'next/link'
import DASHBOARD_LIST from './DASHBOARD_LIST'


export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-width duration-300 bg-white border-r border-gray-200 fixed h-full`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-bold`}>Dashboard</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isSidebarOpen
                    ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7'
                    : 'M13 5l7 7-7 7M5 5l7 7-7 7'
                }
              />
            </svg>
          </button>
        </div>

        <nav className="mt-4">
          {DASHBOARD_LIST.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"

            >
              {item.icon}
              <span className={`${isSidebarOpen ? 'ml-3' : 'hidden'}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } transition-margin duration-300 p-8`}
      >
        {children}
      </main>
    </div>
  )
}
