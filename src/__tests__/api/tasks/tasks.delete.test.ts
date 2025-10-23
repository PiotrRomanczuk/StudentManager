// import { NextRequest } from "next/server";
// import { DELETE } from "@/app/api/development-tasks/route";
// import { createClient } from "@/utils/supabase/clients/server";
// import { expect } from "@jest/globals";

// // Mock the Supabase client
// jest.mock("@/utils/supabase/clients/server", () => ({
//   createClient: jest.fn(),
// }));

// describe("/api/tasks - DELETE", () => {
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

//   describe("DELETE /api/tasks", () => {
//     it("should delete a task successfully", async () => {
//       const mockUser = { id: "user-123" };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue({
//         delete: jest.fn().mockReturnValue({
//           eq: jest.fn().mockResolvedValue({ error: null }),
//         }),
//       });

//       const request = new NextRequest("http://localhost:3000/api/tasks?id=task-123", {
//         method: "DELETE",
//       });

//       const response = await DELETE(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.message).toBe("Task deleted successfully");
//     });

//     it("should return 400 when task ID is missing", async () => {
//       const mockUser = { id: "user-123" };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const request = new NextRequest("http://localhost:3000/api/tasks", {
//         method: "DELETE",
//       });

//       const response = await DELETE(request);
//       const data = await response.json();

//       expect(response.status).toBe(400);
//       expect(data.error).toBe("Task ID is required");
//     });

//     it("should return 401 for unauthenticated user", async () => {
//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: null },
//         error: null,
//       });

//       const request = new NextRequest("http://localhost:3000/api/tasks?id=task-123", {
//         method: "DELETE",
//       });

//       const response = await DELETE(request);
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
//         delete: jest.fn().mockReturnValue({
//           eq: jest.fn().mockResolvedValue({ error: { message: "Database error" } }),
//         }),
//       });

//       const request = new NextRequest("http://localhost:3000/api/tasks?id=task-123", {
//         method: "DELETE",
//       });

//       const response = await DELETE(request);
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data.error).toBe("Failed to delete task");
//     });

//     it("should handle empty task ID parameter", async () => {
//       const mockUser = { id: "user-123" };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const request = new NextRequest("http://localhost:3000/api/tasks?id=", {
//         method: "DELETE",
//       });

//       const response = await DELETE(request);
//       const data = await response.json();

//       expect(response.status).toBe(400);
//       expect(data.error).toBe("Task ID is required");
//     });
//   });
// });
