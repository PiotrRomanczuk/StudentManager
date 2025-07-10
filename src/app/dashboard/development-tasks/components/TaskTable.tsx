import React from "react";
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
  Edit,
  Eye
} from "lucide-react";
import Link from "next/link";

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

interface TaskTableProps {
  tasks: Task[];
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks ({tasks.length})</CardTitle>
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
            {tasks.map((task) => (
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
                  <div className="flex items-center gap-2 border border-red-500 p-2 bg-yellow-100">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-blue-500 text-white hover:bg-blue-600">
                          <Eye className="h-4 w-4 mr-1" />
                          View
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
                    <Button asChild variant="outline" size="sm" className="bg-green-500 text-white hover:bg-green-600">
                      <Link href={`/dashboard/task-management/tasks/${task.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
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