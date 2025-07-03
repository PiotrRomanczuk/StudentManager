"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Star,
  Bug,
  Zap,
  Users,
  Music,
  TestTube,
  Palette,
  Server,
  Brain,
  Target,
  FileText
} from "lucide-react";
import { createClient } from "@/utils/supabase/clients/client";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Not Started" | "In Progress" | "Completed" | "Blocked";
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
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  useEffect(() => {
    const fetchTasks = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("task_management").select("*");

      if (error) {
        setError(error.message);
      } else {
        setTasks(data || []);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

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
  const statuses = ["All", "Not Started", "In Progress", "Completed", "Blocked"];
  const priorities = ["All", "Critical", "High", "Medium", "Low"];

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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Not Started</p>
                <p className="text-2xl font-bold text-gray-600">{stats.notStarted}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <Star className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Task Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(task.category)}
                      {task.category}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(task.priority)}
                      {task.priority}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {task.description || "No description"}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{task.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Description</h4>
                            <p className="text-gray-600">{task.description || "No description available"}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">Category</h4>
                              <p className="text-gray-600">{task.category}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Priority</h4>
                              <p className="text-gray-600">{task.priority}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Status</h4>
                              <p className="text-gray-600">{task.status}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Assignee</h4>
                              <p className="text-gray-600">{task.assignee || "Unassigned"}</p>
                            </div>
                          </div>
                          {task.estimatedEffort && (
                            <div>
                              <h4 className="font-semibold">Estimated Effort</h4>
                              <p className="text-gray-600">{task.estimatedEffort}</p>
                            </div>
                          )}
                          {task.dueDate && (
                            <div>
                              <h4 className="font-semibold">Due Date</h4>
                              <p className="text-gray-600">{task.dueDate}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Critical":
      return <Star className="h-4 w-4 text-red-500" />;
    case "High":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case "Medium":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Low":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  const variants = {
    "Not Started": "secondary",
    "In Progress": "default",
    "Completed": "default",
    "Blocked": "destructive"
  } as const;

  const variant = variants[status as keyof typeof variants] || "secondary";
  return <Badge variant={variant}>{status}</Badge>;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Bugs":
      return <Bug className="h-4 w-4 text-red-500" />;
    case "Most Important":
      return <Star className="h-4 w-4 text-yellow-500" />;
    case "Authentication & User Management":
      return <Users className="h-4 w-4 text-blue-500" />;
    case "Core Features":
      return <Zap className="h-4 w-4 text-purple-500" />;
    case "Testing & Quality Assurance":
      return <TestTube className="h-4 w-4 text-green-500" />;
    case "UI/UX Improvements":
      return <Palette className="h-4 w-4 text-pink-500" />;
    case "Infrastructure & Performance":
      return <Server className="h-4 w-4 text-gray-500" />;
    case "AI & Machine Learning":
      return <Brain className="h-4 w-4 text-indigo-500" />;
    case "Music & Audio":
      return <Music className="h-4 w-4 text-orange-500" />;
    default:
      return <Target className="h-4 w-4 text-gray-500" />;
  }
}; 