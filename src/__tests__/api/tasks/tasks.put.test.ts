import { NextRequest } from "next/server";
import { PUT } from "@/app/api/development-tasks/route";
import { createClient } from "@/utils/supabase/clients/server";
import { expect } from "@jest/globals";

// Mock the Supabase client
jest.mock("@/utils/supabase/clients/server");

describe("/api/tasks - PUT", () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("PUT /api/tasks", () => {
    it("should update a task successfully with all fields", async () => {
      const mockUser = { id: "user-123" };
      const taskData = {
        id: "task-123",
        title: "Updated Task",
        description: "Updated description",
        category: "Development",
        priority: "Medium",
        status: "In Progress",
        estimatedEffort: "3 days",
        assigneeId: "user-456",
        dueDate: "2024-01-20",
        tags: ["frontend", "bug"],
        externalLink: "https://github.com/issue/123",
        notes: "Additional notes for the task",
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      const request = new NextRequest("http://localhost:3000/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Task updated successfully");
    });

    it("should update a task with minimal fields", async () => {
      const mockUser = { id: "user-123" };
      const minimalTaskData = {
        id: "task-123",
        title: "Minimal Task Update",
        category: "Testing",
        priority: "Low",
        status: "Completed",
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      const request = new NextRequest("http://localhost:3000/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(minimalTaskData),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Task updated successfully");
    });

    it("should return 401 for unauthenticated user", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const request = new NextRequest("http://localhost:3000/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "task-123", title: "Test" }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should handle database errors", async () => {
      const mockUser = { id: "user-123" };
      const taskData = {
        id: "task-123",
        title: "Test Task",
        category: "Development",
        priority: "High",
        status: "In Progress",
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ 
            error: { message: "Database error" } 
          }),
        }),
      });

      const request = new NextRequest("http://localhost:3000/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to update task");
    });

    it("should handle invalid JSON", async () => {
      const request = new NextRequest("http://localhost:3000/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: "invalid json",
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });
  });
}); 