"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  Settings,
  FileText
} from "lucide-react";

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

const tasks: Task[] = [
  // BUGS
  {
    id: "bug-1",
    title: "Lessons shows number for students, but not for teacher",
    category: "Bugs",
    priority: "High",
    status: "Not Started",
    description: "Lesson numbering display issue for teachers",
  },
  {
    id: "bug-2",
    title: "Students have access to edit/delete lessons",
    category: "Bugs",
    priority: "Critical",
    status: "Not Started",
    description: "Security vulnerability - students can modify lessons",
  },
  {
    id: "bug-3",
    title: "Add infinity scroll for mobile tables",
    category: "Bugs",
    priority: "Medium",
    status: "Not Started",
    description: "Mobile table pagination improvement",
  },

  // Most Important
  {
    id: "imp-1",
    title: "Responsive Tables for mobile",
    category: "Most Important",
    priority: "Critical",
    status: "In Progress",
    description: "Mobile-responsive table layouts",
  },
  {
    id: "imp-2",
    title: "QUIZES for chords diagrams",
    category: "Most Important",
    priority: "High",
    status: "Not Started",
    description: "Interactive chord diagram quizzes",
  },
  {
    id: "imp-3",
    title: "Adding lessons only for teachers",
    category: "Most Important",
    priority: "Critical",
    status: "Completed",
    description: "Security fix - restrict lesson creation to teachers",
  },
  {
    id: "imp-4",
    title: "TASKS for students",
    category: "Most Important",
    priority: "High",
    status: "In Progress",
    description: "Assignment/task system for students",
  },
  {
    id: "imp-5",
    title: "Song Table filtration through students",
    category: "Most Important",
    priority: "Medium",
    status: "Not Started",
    description: "Filter songs by student",
  },
  {
    id: "imp-6",
    title: "Lesson Table filtration through students",
    category: "Most Important",
    priority: "Medium",
    status: "Not Started",
    description: "Filter lessons by student",
  },
  {
    id: "imp-7",
    title: "CSS responsive styles for phones",
    category: "Most Important",
    priority: "High",
    status: "In Progress",
    description: "Mobile-first responsive design",
  },
  {
    id: "imp-8",
    title: "Updating the database songs",
    category: "Most Important",
    priority: "Medium",
    status: "Not Started",
    description: "Database schema updates for songs",
  },
  {
    id: "imp-9",
    title: "Improve UX for adding lessons",
    category: "Most Important",
    priority: "Medium",
    status: "Not Started",
    description: "Better lesson creation user experience",
  },
  {
    id: "imp-10",
    title: "Google Drive API integration",
    category: "Most Important",
    priority: "High",
    status: "In Progress",
    description: "Google Drive file management integration",
  },
  {
    id: "imp-11",
    title: "Adding lessons recursively",
    category: "Most Important",
    priority: "Medium",
    status: "Not Started",
    description: "Recurring lesson scheduling",
  },
  {
    id: "imp-12",
    title: "LLM Stuffs",
    category: "Most Important",
    priority: "Low",
    status: "Not Started",
    description: "AI/LLM integration features",
  },

  // Authentication & User Management
  {
    id: "auth-1",
    title: "Getting list of all users, and adding to favourite songs to other users",
    category: "Authentication & User Management",
    priority: "Medium",
    status: "Not Started",
    description: "User management and song sharing features",
  },
  {
    id: "auth-2",
    title: "Fixing updating profile + avatar profile",
    category: "Authentication & User Management",
    priority: "Medium",
    status: "Not Started",
    description: "Profile and avatar update functionality",
  },
  {
    id: "auth-3",
    title: "Adding gmail account for access to google drive",
    category: "Authentication & User Management",
    priority: "High",
    status: "In Progress",
    description: "Gmail integration for Google Drive access",
  },

  // Core Features
  {
    id: "core-1",
    title: "Adding songs to favourite for user",
    category: "Core Features",
    priority: "Medium",
    status: "Completed",
    description: "User favorite songs functionality",
  },
  {
    id: "core-2",
    title: "Adding Calendar to see the past and futures lessons",
    category: "Core Features",
    priority: "High",
    status: "In Progress",
    description: "Calendar view for lessons",
  },
  {
    id: "core-3",
    title: "Creating Lesson object for Users",
    category: "Core Features",
    priority: "High",
    status: "Completed",
    description: "Lesson data structure implementation",
  },
  {
    id: "core-4",
    title: "RLS Policy on songs table, users can get only songs from the lessons",
    category: "Core Features",
    priority: "High",
    status: "In Progress",
    description: "Row Level Security for songs access",
  },
  {
    id: "core-5",
    title: "Adding Spotify API for songs",
    category: "Core Features",
    priority: "Medium",
    status: "In Progress",
    description: "Spotify integration for song data",
  },

  // Testing & Quality Assurance
  {
    id: "test-1",
    title: "Adding tests",
    category: "Testing & Quality Assurance",
    priority: "Medium",
    status: "Not Started",
    description: "Comprehensive test suite implementation",
  },

  // UI/UX
  {
    id: "ui-1",
    title: "Responsive styles",
    category: "UI/UX",
    priority: "High",
    status: "In Progress",
    description: "Mobile-responsive design implementation",
  },
  {
    id: "ui-2",
    title: "Improve the UI of song page, and edit form for song",
    category: "UI/UX",
    priority: "Medium",
    status: "Not Started",
    description: "Song page and form UI improvements",
  },
  {
    id: "ui-3",
    title: "Add toasts for user actions/experiences",
    category: "UI/UX",
    priority: "Low",
    status: "Not Started",
    description: "User feedback notifications",
  },

  // DevOps & Infrastructure
  {
    id: "devops-1",
    title: "Contenerize app in Docker",
    category: "DevOps & Infrastructure",
    priority: "Low",
    status: "Not Started",
    description: "Docker containerization",
  },

  // AI & Learning Features
  {
    id: "ai-1",
    title: "Adding LLM with Vercel.AI",
    category: "AI & Learning Features",
    priority: "Low",
    status: "Not Started",
    description: "Vercel AI integration",
  },
  {
    id: "ai-2",
    title: "Adding LLM to generate basic music theory questions, answers, explanations, exercises, tests, quizzes, flashcards",
    category: "AI & Learning Features",
    priority: "Low",
    status: "Not Started",
    description: "AI-powered music theory content generation",
  },
  {
    id: "ai-3",
    title: "Create interactive chords, scales, rhythms, melodies, harmonies, compositions, improvisations, ear training sections",
    category: "AI & Learning Features",
    priority: "Low",
    status: "Not Started",
    description: "Interactive music learning tools",
  },

  // Future Feature Suggestions
  {
    id: "future-1",
    title: "Implement real-time pitch detection for vocal/instrument practice",
    category: "Future Features",
    priority: "Low",
    status: "Not Started",
    description: "Real-time audio analysis",
  },
  {
    id: "future-2",
    title: "Add gamification elements (achievements, progress badges, streaks)",
    category: "Future Features",
    priority: "Low",
    status: "Not Started",
    description: "Gamification system",
  },
  {
    id: "future-3",
    title: "Create practice tracking with statistics and insights",
    category: "Future Features",
    priority: "Low",
    status: "Not Started",
    description: "Practice analytics and insights",
  },
  {
    id: "future-4",
    title: "Add video lesson recording/playback features",
    category: "Future Features",
    priority: "Low",
    status: "Not Started",
    description: "Video lesson functionality",
  },
  {
    id: "future-5",
    title: "Implement smart practice recommendations based on user progress",
    category: "Future Features",
    priority: "Low",
    status: "Not Started",
    description: "AI-powered practice recommendations",
  },
  {
    id: "future-6",
    title: "Implement metronome and tuner tools",
    category: "Future Features",
    priority: "Low",
    status: "Not Started",
    description: "Music practice tools",
  },
  {
    id: "future-7",
    title: "Add support for MIDI keyboard input",
    category: "Future Features",
    priority: "Low",
    status: "Not Started",
    description: "MIDI device integration",
  },
  {
    id: "future-8",
    title: "Add personalized practice routine generator",
    category: "Future Features",
    priority: "Low",
    status: "Not Started",
    description: "Personalized practice plans",
  },
  {
    id: "future-9",
    title: "Create AI teaching assistant for immediate feedback",
    category: "Future Features",
    priority: "Low",
    status: "Not Started",
    description: "AI teaching assistant",
  },
  {
    id: "future-10",
    title: "Implement automated accompaniment generation",
    category: "Future Features",
    priority: "Low",
    status: "Not Started",
    description: "AI-generated accompaniments",
  },
];

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Critical":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "High":
      return <Star className="h-4 w-4 text-orange-500" />;
    case "Medium":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Low":
      return <FileText className="h-4 w-4 text-gray-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    case "In Progress":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
    case "Blocked":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Blocked</Badge>;
    case "Not Started":
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not Started</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Bugs":
      return <Bug className="h-4 w-4 text-red-500" />;
    case "Most Important":
      return <Zap className="h-4 w-4 text-yellow-500" />;
    case "Authentication & User Management":
      return <Users className="h-4 w-4 text-blue-500" />;
    case "Core Features":
      return <Music className="h-4 w-4 text-purple-500" />;
    case "Testing & Quality Assurance":
      return <TestTube className="h-4 w-4 text-green-500" />;
    case "UI/UX":
      return <Palette className="h-4 w-4 text-pink-500" />;
    case "DevOps & Infrastructure":
      return <Server className="h-4 w-4 text-gray-500" />;
    case "AI & Learning Features":
      return <Brain className="h-4 w-4 text-indigo-500" />;
    case "Future Features":
      return <Target className="h-4 w-4 text-teal-500" />;
    default:
      return <Settings className="h-4 w-4 text-gray-500" />;
  }
};

export const TaskManagement = () => {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    notStarted: tasks.filter(t => t.status === "Not Started").length,
    critical: tasks.filter(t => t.priority === "Critical").length,
  };

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
          <CardTitle>Project Tasks ({filteredTasks.length} of {tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(task.priority)}
                        {task.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(task.category)}
                        <span className="text-sm">{task.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(task.priority)}
                        <span className="text-sm">{task.priority}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(task.status)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-gray-600 truncate">
                        {task.description || "No description available"}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 