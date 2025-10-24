// import { NextRequest } from "next/server";
// import { GET } from "@/app/api/(main)/song/student-songs/route";
// import { createClient } from "@/utils/supabase/clients/server";

// // Mock the Supabase client
// jest.mock("@/utils/supabase/clients/server");

// const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

// describe("GET /api/song/student-songs", () => {
//   let mockSupabase: any;

//   beforeEach(() => {
//     mockSupabase = {
//       from: jest.fn().mockReturnThis(),
//       select: jest.fn().mockReturnThis(),
//       in: jest.fn().mockReturnThis(),
//       rpc: jest.fn().mockReturnThis(),
//     };
//     mockCreateClient.mockResolvedValue(mockSupabase);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("when studentId is provided", () => {
//     it("should return songs with status for student", async () => {
//       const mockStudentSongsID = [
//         { song_id: "song-1", song_status: "learning" },
//         { song_id: "song-2", song_status: "completed" },
//       ];
//       const mockSongs = [
//         { id: "song-1", title: "Song 1", author: "Author 1" },
//         { id: "song-2", title: "Song 2", author: "Author 2" },
//       ];

//       mockSupabase.rpc.mockResolvedValueOnce({
//         data: mockStudentSongsID,
//         error: null,
//       });

//       mockSupabase.from.mockReturnValueOnce({
//         select: jest.fn().mockReturnValueOnce({
//           in: jest.fn().mockResolvedValueOnce({
//             data: mockSongs,
//             error: null,
//           }),
//         }),
//       });

//       const request = new NextRequest(
//         "http://localhost:3000/api/song/student-songs?studentId=student-123"
//       );

//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data).toEqual({
//         songs: [
//           { id: "song-1", title: "Song 1", author: "Author 1", status: "learning" },
//           { id: "song-2", title: "Song 2", author: "Author 2", status: "completed" },
//         ],
//         total: 2,
//       });
//     });

//     it("should return empty array when student has no songs", async () => {
//       mockSupabase.rpc.mockResolvedValueOnce({
//         data: [],
//         error: null,
//       });

//       const request = new NextRequest(
//         "http://localhost:3000/api/song/student-songs?studentId=student-123"
//       );

//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data).toEqual({ songs: [], total: 0 });
//     });

//     it("should handle RPC error", async () => {
//       mockSupabase.rpc.mockResolvedValueOnce({
//         data: null,
//         error: { message: "RPC function error" },
//       });

//       const request = new NextRequest(
//         "http://localhost:3000/api/song/student-songs?studentId=student-123"
//       );

//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data).toEqual({ error: "Error fetching student songs" });
//     });

//     it("should handle error when fetching song details", async () => {
//       const mockStudentSongsID = [
//         { song_id: "song-1", song_status: "learning" },
//       ];

//       mockSupabase.rpc.mockResolvedValueOnce({
//         data: mockStudentSongsID,
//         error: null,
//       });

//       mockSupabase.from.mockReturnValueOnce({
//         select: jest.fn().mockReturnValueOnce({
//           in: jest.fn().mockResolvedValueOnce({
//             data: null,
//             error: { message: "Database error" },
//           }),
//         }),
//       });

//       const request = new NextRequest(
//         "http://localhost:3000/api/song/student-songs?studentId=student-123"
//       );

//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data).toEqual({ error: "Error fetching songs details" });
//     });

//     it("should handle unexpected errors", async () => {
//       mockSupabase.rpc.mockRejectedValueOnce(new Error("Unexpected error"));

//       const request = new NextRequest(
//         "http://localhost:3000/api/song/student-songs?studentId=student-123"
//       );

//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data).toEqual({ error: "Internal server error" });
//     });
//   });

//   describe("when studentId is not provided", () => {
//     it("should return 400 error", async () => {
//       const request = new NextRequest(
//         "http://localhost:3000/api/song/student-songs"
//       );

//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(400);
//       expect(data).toEqual({ error: "Student ID is required" });
//     });
//   });
// });
