"use client";
// import { Song } from "@/types/Song";
import React, { useState } from "react";
import { Stats } from "../admin/Stats";
import { Lessons } from "../admin/Lessons";
import { Assignments } from "../admin/Assignments";
import { Calendar } from "../admin/Calendar";
import { tabList } from "../admin/data";

// interface AdminPageProps {
//   songs: Song[];
// }

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(0);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Lessons />;
      case 1:
        return <Calendar />;
      case 2:
        return <Assignments />;
      default:
        return <Lessons />;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Dashboard</h2>
          <div className="text-admin-gray-DEFAULT text-xs sm:text-sm">
            Today: {today}
          </div>
        </div>
        <button className="bg-admin-blue-DEFAULT hover:bg-admin-blue-dark text-white font-semibold px-3 sm:px-5 py-2 rounded-lg shadow flex items-center gap-2 self-start md:self-auto text-xs sm:text-base transition-colors">
          + Add New Student
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-4 sm:mb-6">
        <Stats />
      </div>

      {/* Tabs */}
      <div className="border-b border-admin-gray-light mb-4 flex gap-1 sm:gap-6 overflow-x-auto pb-1">
        {tabList.map((tab, idx) => (
          <button
            key={tab}
            className={`pb-2 px-1 text-sm sm:text-lg font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === idx
                ? "border-admin-blue-DEFAULT text-admin-blue-DEFAULT"
                : "border-transparent text-admin-gray-DEFAULT hover:text-admin-blue-DEFAULT"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 gap-4 sm:gap-8 mb-6 sm:mb-8">
        {renderTabContent()}
      </div>

      {/* Recent Assignments */}
      <div className="mt-4 sm:mt-6">
        <Assignments />
      </div>
    </div>
  );
};
