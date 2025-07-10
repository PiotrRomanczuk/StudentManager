"use client";

import React, { useState, useEffect } from "react";
import { TaskFilters } from "./components/TaskFilters";
import { TaskTable } from "./components/TaskTable";
import { TaskStats } from "./components/TaskStats";
import { STATUSES, PRIORITIES, CATEGORIES } from "./CONSTANTS";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: typeof PRIORITIES[number];
  status: typeof STATUSES[number];
  description?: string;
  estimatedEffort?: string;
  assignee?: string;
  dueDate?: string;
}

export const TaskManagementClient = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState(CATEGORIES[0]);
  const [filterStatus, setFilterStatus] = useState(STATUSES[0]);
  const [filterPriority, setFilterPriority] = useState(PRIORITIES[0]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log("Fetching tasks from API...");
        const response = await fetch("/api/development-tasks");
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const error = await response.json();
          console.error("API Error:", error);
          setError(error.error || "Failed to fetch tasks");
        } else {
          const data = await response.json();
          console.log("API Response:", data);
          setTasks(data.tasks || []);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch tasks");
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  console.log("Current state:", { loading, error, tasksCount: tasks.length, tasks });

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    notStarted: tasks.filter(t => t.status === "Not Started").length,
    critical: tasks.filter(t => t.priority === "Critical").length,
  };

  const categories = ["All", ...Array.from(new Set(tasks.map(task => task.category)))];
 

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = filterCategory === "All" || task.category === filterCategory;
    const matchesStatus = filterStatus === "All" || task.status === filterStatus;
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h3 className="font-bold">Debug Info:</h3>
        <p>Loading: {loading.toString()}</p>
        <p>Error: {error || "None"}</p>
        <p>Tasks count: {tasks.length}</p>
        <p>Filtered tasks count: {filteredTasks.length}</p>
      </div>
      
      <TaskStats stats={stats} />
      
      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        categories={categories}
        statuses={STATUSES}
        priorities={PRIORITIES}
      />
      
      {filteredTasks.length > 0 ? (
        <TaskTable tasks={filteredTasks} />
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {tasks.length === 0 ? "No tasks in database" : "No tasks match your filters"}
          </p>
        </div>
      )}
    </div>
  );
}; 