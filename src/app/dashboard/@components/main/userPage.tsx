'use client'
import { Song } from "@/types/Song";
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { ShortSongTable } from "../cards/ShortSongTable";

interface UserPageProps {
  songs: Song[];
}

const UserPage = ({ songs }: UserPageProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tabList = ["My Lessons", "Assignments", "Progress"];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Student Dashboard</h2>
          <div className="text-gray-500 text-sm">Today: {today}</div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow flex items-center gap-2 self-start md:self-auto">
          View Schedule
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Upcoming Lessons</h3>
          <p className="text-2xl font-bold">2</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Assignments</h3>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Practice Hours</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4 flex gap-6">
        {tabList.map((tab, idx) => (
          <button
            key={tab}
            className={`pb-2 px-1 text-lg font-medium border-b-2 transition-colors ${
              activeTab === idx ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">My Lessons</h3>
          <div className="text-gray-400 italic text-center py-10">Your upcoming lessons will appear here...</div>
        </div>
      )}
      {activeTab === 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Assignments</h3>
          <div className="text-gray-400 italic text-center py-10">Your assignments will appear here...</div>
        </div>
      )}
      {activeTab === 2 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Progress</h3>
          <div className="text-gray-400 italic text-center py-10">Your progress tracking will appear here...</div>
        </div>
      )}

      {/* Recent Songs */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Songs</h2>
          <ShortSongTable songs={songs} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
