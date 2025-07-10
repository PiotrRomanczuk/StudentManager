"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
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
  Target
} from "lucide-react";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  category: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Not Started" | "In Progress" | "Completed" | "Blocked";
  description?: string;
  estimated_effort?: string;
  assignee_id?: string;
  due_date?: string;
  tags?: string[];
  external_link?: string;
  notes?: string;
}

interface TaskEditClientProps {
  task: Task;
}

export const TaskEditClient: React.FC<TaskEditClientProps> = ({ task }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    category: task.category,
    priority: task.priority,
    status: task.status,
    estimatedEffort: task.estimated_effort || "",
    assigneeId: task.assignee_id || "",
    dueDate: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : "",
    tags: task.tags?.join(", ") || "",
    externalLink: task.external_link || "",
    notes: task.notes || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: task.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          status: formData.status,
          estimatedEffort: formData.estimatedEffort,
          assigneeId: formData.assigneeId || null,
          dueDate: formData.dueDate || null,
          tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : null,
          externalLink: formData.externalLink || null,
          notes: formData.notes || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update task");
      }

      router.push("/dashboard/task-management");
      router.refresh();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks?id=${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete task");
      }

      router.push("/dashboard/task-management");
      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/dashboard/task-management">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter task description"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bugs">Bugs</SelectItem>
                        <SelectItem value="Most Important">Most Important</SelectItem>
                        <SelectItem value="Authentication & User Management">Authentication & User Management</SelectItem>
                        <SelectItem value="Core Features">Core Features</SelectItem>
                        <SelectItem value="Testing & Quality Assurance">Testing & Quality Assurance</SelectItem>
                        <SelectItem value="UI/UX Improvements">UI/UX Improvements</SelectItem>
                        <SelectItem value="Infrastructure & Performance">Infrastructure & Performance</SelectItem>
                        <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                        <SelectItem value="Music & Audio">Music & Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleInputChange("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedEffort">Estimated Effort</Label>
                    <Input
                      id="estimatedEffort"
                      value={formData.estimatedEffort}
                      onChange={(e) => handleInputChange("estimatedEffort", e.target.value)}
                      placeholder="e.g., 2 days, 4 hours"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assigneeId">Assignee ID</Label>
                    <Input
                      id="assigneeId"
                      value={formData.assigneeId}
                      onChange={(e) => handleInputChange("assigneeId", e.target.value)}
                      placeholder="User ID of assignee"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="externalLink">External Link</Label>
                  <Input
                    id="externalLink"
                    value={formData.externalLink}
                    onChange={(e) => handleInputChange("externalLink", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Additional notes"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/task-management")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Task Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{formData.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {formData.description || "No description"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {getCategoryIcon(formData.category)}
                <span className="text-sm font-medium">{formData.category}</span>
              </div>

              <div className="flex items-center gap-2">
                {getPriorityIcon(formData.priority)}
                <span className="text-sm font-medium">{formData.priority}</span>
              </div>

              <div>
                <Badge variant={
                  formData.status === "Completed" ? "default" :
                  formData.status === "In Progress" ? "default" :
                  formData.status === "Blocked" ? "destructive" : "secondary"
                }>
                  {formData.status}
                </Badge>
              </div>

              {formData.estimatedEffort && (
                <div>
                  <span className="text-sm font-medium">Estimated Effort:</span>
                  <p className="text-sm text-gray-600">{formData.estimatedEffort}</p>
                </div>
              )}

              {formData.dueDate && (
                <div>
                  <span className="text-sm font-medium">Due Date:</span>
                  <p className="text-sm text-gray-600">{formData.dueDate}</p>
                </div>
              )}

              {formData.tags && (
                <div>
                  <span className="text-sm font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.tags.split(",").map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 