'use client'
import { Song } from "@/types/Song";
import React, { useState } from "react";
import { Stats } from "../admin/Stats";
import { Lessons } from "../admin/Lessons";
import { Students } from "../admin/Students";
import { Assignments } from "../admin/Assignments";
import { tabList } from "../admin/data";

interface AdminPageProps {
  songs: Song[];
}

const AdminPage = ({ songs }: AdminPageProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="text-gray-500 text-sm">Today: {today}</div>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow flex items-center gap-2 self-start md:self-auto">
          + Add New Student
        </button>
      </div>

      {/* Stats Cards */}
      <Stats />

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
      {activeTab === 0 && <Lessons />}
      {activeTab === 1 && (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Students />
        </div>
      )}
      {activeTab === 2 && (
        <div className="text-gray-400 italic text-center py-10">Upcoming schedule feature coming soon...</div>
      )}

      {/* Recent Assignments */}
      <Assignments />
    </div>
  );
};

export default AdminPage;