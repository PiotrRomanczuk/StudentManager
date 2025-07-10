import { NextRequest } from "next/server";
import { GET } from "@/app/api/development-tasks/route";
import { createClient } from "@/utils/supabase/clients/server";
import { expect } from "@jest/globals";

// Mock the Supabase client
jest.mock("@/utils/supabase/clients/server", () => ({
  createClient: jest.fn(),
}));

describe("/api/tasks - GET", () => {
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

  describe("GET /api/tasks", () => {
    it("should return tasks for authenticated user", async () => {
      const mockUser = { id: "user-123" };
      const mockTasks = [
        { id: "1", title: "Test Task", category: "Test", priority: "High", status: "In Progress" },
        { id: "2", title: "Another Task", category: "Test", priority: "Medium", status: "Completed" },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockTasks, error: null }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toEqual(mockTasks);
    });

    it("should return 401 for unauthenticated user", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 500 on database error", async () => {
      const mockUser = { id: "user-123" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: null, error: { message: "Database error" } }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch tasks");
    });

    it("should return empty array when no tasks exist", async () => {
      const mockUser = { id: "user-123" };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toEqual([]);
    });
  });
}); 