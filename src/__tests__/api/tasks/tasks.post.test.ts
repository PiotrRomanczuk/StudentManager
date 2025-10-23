// import { NextRequest } from "next/server";
// import { POST } from "@/app/api/development-tasks/route";
// import { createClient } from "@/utils/supabase/clients/server";
// import { expect } from "@jest/globals";

// // Mock the Supabase client
// jest.mock("@/utils/supabase/clients/server", () => ({
//   createClient: jest.fn(),
// }));

// describe("/api/tasks - POST", () => {
//   let mockSupabase: any;

//   beforeEach(() => {
//     mockSupabase = {
//       auth: {
//         getUser: jest.fn(),
//       },
//       from: jest.fn(),
//     };
//     (createClient as jest.Mock).mockResolvedValue(mockSupabase);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("POST /api/tasks", () => {
//     it("should create a new task successfully", async () => {
//       const mockUser = { id: "user-123" };
//       const taskData = {
//         title: "New Task",
//         description: "Task description",
//         category: "Development",
//         priority: "High",
//         status: "Not Started",
//         estimatedEffort: "2 days",
//         assigneeId: "user-456",
//         dueDate: "2024-01-15",
//       };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue({
//         insert: jest.fn().mockResolvedValue({ error: null }),
//       });

//       const request = new NextRequest("http://localhost:3000/api/tasks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(taskData),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.message).toBe("Task created successfully");
//     });

//     it("should create a task with minimal required fields", async () => {
//       const mockUser = { id: "user-123" };
//       const minimalTaskData = {
//         title: "Minimal Task",
//         category: "Testing",
//         priority: "Low",
//         status: "Not Started",
//       };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue({
//         insert: jest.fn().mockResolvedValue({ error: null }),
//       });

//       const request = new NextRequest("http://localhost:3000/api/tasks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(minimalTaskData),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.message).toBe("Task created successfully");
//     });

//     it("should return 401 for unauthenticated user", async () => {
//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: null },
//         error: null,
//       });

//       const request = new NextRequest("http://localhost:3000/api/tasks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title: "Test" }),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(401);
//       expect(data.error).toBe("Unauthorized");
//     });

//     it("should return 500 on database error", async () => {
//       const mockUser = { id: "user-123" };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue({
//         insert: jest.fn().mockResolvedValue({ error: { message: "Database error" } }),
//       });

//       const request = new NextRequest("http://localhost:3000/api/tasks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title: "Test" }),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data.error).toBe("Failed to create task");
//     });

//     it("should handle malformed JSON gracefully", async () => {
//       const mockUser = { id: "user-123" };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const request = new NextRequest("http://localhost:3000/api/tasks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: "invalid json",
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data.error).toBe("Internal server error");
//     });
//   });
// });
