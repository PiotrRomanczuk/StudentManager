import { TaskTable } from "../components/TaskTable";

const sampleTasks = [
  {
    id: "test-1",
    title: "Test Task 1",
    category: "Bugs",
    priority: "High" as const,
    status: "In Progress" as const,
    description: "This is a test task for verifying the buttons work correctly",
    estimatedEffort: "2 days",
    assignee: "Test User",
    dueDate: "2024-01-15",
  },
  {
    id: "test-2",
    title: "Test Task 2",
    category: "Most Important",
    priority: "Critical" as const,
    status: "Not Started" as const,
    description: "Another test task to verify the edit and view buttons",
    estimatedEffort: "1 week",
    assignee: "Admin User",
    dueDate: "2024-01-20",
  },
];

export default function TestTaskPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Table Test</h1>
        <p className="text-gray-600 mb-6">
          This page shows the task table with sample data to verify the View and Edit buttons are working.
        </p>
        <TaskTable tasks={sampleTasks} />
      </div>
    </div>
  );
} 