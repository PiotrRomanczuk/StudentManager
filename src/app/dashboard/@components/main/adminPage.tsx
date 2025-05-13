"use client";
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
          <div className="text-admin-gray-DEFAULT text-sm">Today: {today}</div>
        </div>
        <button className="bg-admin-blue-DEFAULT hover:bg-admin-blue-dark text-white font-semibold px-5 py-2 rounded-lg shadow flex items-center gap-2 self-start md:self-auto">
          + Add New Student
        </button>
      </div>

      {/* Stats Cards */}
      <Stats />

      {/* Tabs */}
      <div className="border-b border-admin-gray-light mb-4 flex gap-6">
        {tabList.map((tab, idx) => (
          <button
            key={tab}
            className={`pb-2 px-1 text-lg font-medium border-b-2 transition-colors ${
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
      {activeTab === 0 && <Lessons />}
      {activeTab === 1 && (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-admin-gray-dark">
              Students
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-admin-gray-light">
                <thead className="bg-admin-gray-lightest">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-gray-DEFAULT uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-gray-DEFAULT uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-admin-gray-DEFAULT uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-admin-gray-light">
                  <tr className="hover:bg-admin-gray-lightest transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-admin-blue-light flex items-center justify-center">
                          <span className="text-admin-blue-DEFAULT font-medium">JD</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-admin-gray-darker">
                            John Doe
                          </div>
                          <div className="text-sm text-admin-gray-DEFAULT">
                            john@example.com
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-admin-green-light text-admin-green-dark">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-gray-DEFAULT">
                      <div className="w-full bg-admin-gray-light rounded-full h-2.5">
                        <div
                          className="bg-admin-blue-DEFAULT h-2.5 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {activeTab === 2 && (
        <div className="text-admin-gray-DEFAULT italic text-center py-10">
          Upcoming schedule feature coming soon...
        </div>
      )}

      {/* Recent Assignments */}
      <Assignments />
    </div>
  );
};

export default AdminPage;
