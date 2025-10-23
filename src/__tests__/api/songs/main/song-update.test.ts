// import '@testing-library/jest-dom';
// import { NextRequest } from "next/server";
// import { PUT } from "@/app/api/(main)/song/update/route";
// import { createClient } from "@/utils/supabase/clients/server";

// // Mock the Supabase client
// jest.mock("@/utils/supabase/clients/server");

// const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

// describe("PUT /api/song/update", () => {
//   let mockSupabase: any;

//   beforeEach(() => {
//     mockSupabase = {
//       from: jest.fn().mockReturnThis(),
//       select: jest.fn().mockReturnThis(),
//       eq: jest.fn().mockReturnThis(),
//       update: jest.fn().mockReturnThis(),
//     };
//     mockCreateClient.mockResolvedValue(mockSupabase);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("when song exists", () => {
//     it("should update song successfully", async () => {
//       const existingSong = {
//         id: "song-123",
//         title: "Old Title",
//         author: "Old Author",
//       };
//       const updatedSong = {
//         id: "song-123",
//         title: "New Title",
//         author: "New Author",
//         level: "Intermediate",
//         key: "C",
//         chords: "C, F, G",
//         updated_at: "2024-01-01T00:00:00.000Z", // Mock timestamp
//       };

//       mockSupabase.from
//         .mockReturnValueOnce({
//           select: jest.fn().mockReturnValueOnce({
//             eq: jest.fn().mockReturnValueOnce({
//               single: jest.fn().mockResolvedValueOnce({
//                 data: existingSong,
//                 error: null,
//               }),
//             }),
//           }),
//         })
//         .mockReturnValueOnce({
//           update: jest.fn().mockReturnValueOnce({
//             eq: jest.fn().mockReturnValueOnce({
//               select: jest.fn().mockResolvedValueOnce({
//                 data: [updatedSong],
//                 error: null,
//               }),
//             }),
//           }),
//         });

//       const request = new NextRequest(
//         "http://localhost:3000/api/song/update",
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             id: "song-123",
//             title: "New Title",
//             author: "New Author",
//             level: "Intermediate",
//             key: "C",
//             chords: "C, F, G",
//           }),
//         }
//       );

//       const response = await PUT(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data).toEqual({ data: updatedSong });
//     });

//     it("should handle database error during update", async () => {
//       const existingSong = {
//         id: "song-123",
//         title: "Old Title",
//         author: "Old Author",
//       };

//       mockSupabase.from
//         .mockReturnValueOnce({
//           select: jest.fn().mockReturnValueOnce({
//             eq: jest.fn().mockReturnValueOnce({
//               single: jest.fn().mockResolvedValueOnce({
//                 data: existingSong,
//                 error: null,
//               }),
//             }),
//           }),
//         })
//         .mockReturnValueOnce({
//           update: jest.fn().mockReturnValueOnce({
//             eq: jest.fn().mockReturnValueOnce({
//               select: jest.fn().mockResolvedValueOnce({
//                 data: null,
//                 error: { message: "Database error" },
//               }),
//             }),
//           }),
//         });

//       const request = new NextRequest(
//         "http://localhost:3000/api/song/update",
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             id: "song-123",
//             title: "New Title",
//             author: "New Author",
//           }),
//         }
//       );

//       const response = await PUT(request);
//       const data = await response.json();

//       expect(response.status).toBe(400);
//       expect(data).toEqual({ error: "Database error" });
//     });

//     it("should handle case where no song was updated", async () => {
//       const existingSong = {
//         id: "song-123",
//         title: "Old Title",
//         author: "Old Author",
//       };

//       mockSupabase.from
//         .mockReturnValueOnce({
//           select: jest.fn().mockReturnValueOnce({
//             eq: jest.fn().mockReturnValueOnce({
//               single: jest.fn().mockResolvedValueOnce({
//                 data: existingSong,
//                 error: null,
//               }),
//             }),
//           }),
//         })
//         .mockReturnValueOnce({
//           update: jest.fn().mockReturnValueOnce({
//             eq: jest.fn().mockReturnValueOnce({
//               select: jest.fn().mockResolvedValueOnce({
//                 data: [],
//                 error: null,
//               }),
//             }),
//           }),
//         });

//       const request = new NextRequest(
//         "http://localhost:3000/api/song/update",
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             id: "song-123",
//             title: "New Title",
//             author: "New Author",
//           }),
//         }
//       );

//       const response = await PUT(request);
//       const data = await response.json();

//       expect(response.status).toBe(404);
//       expect(data).toEqual({ error: "No song was updated" });
//     });
//   });

//   describe("when song does not exist", () => {
//     it("should return 404 error", async () => {
//       mockSupabase.from.mockReturnValueOnce({
//         select: jest.fn().mockReturnValueOnce({
//           eq: jest.fn().mockReturnValueOnce({
//             single: jest.fn().mockResolvedValueOnce({
//               data: null,
//               error: null,
//             }),
//           }),
//         }),
//       });

//       const request = new NextRequest(
//         "http://localhost:3000/api/song/update",
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             id: "nonexistent-song",
//             title: "New Title",
//             author: "New Author",
//           }),
//         }
//       );

//       const response = await PUT(request);
//       const data = await response.json();

//       expect(response.status).toBe(404);
//       expect(data).toEqual({
//         error: "No song found with the specified ID",
//       });
//     });
//   });

//   describe("when database error occurs during song lookup", () => {
//     it("should handle database error", async () => {
//       mockSupabase.from.mockReturnValueOnce({
//         select: jest.fn().mockReturnValueOnce({
//           eq: jest.fn().mockReturnValueOnce({
//             single: jest.fn().mockResolvedValueOnce({
//               data: null,
//               error: { message: "Database error" },
//             }),
//           }),
//         }),
//       });

//       const request = new NextRequest(
//         "http://localhost:3000/api/song/update",
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             id: "song-123",
//             title: "New Title",
//             author: "New Author",
//           }),
//         }
//       );

//       const response = await PUT(request);
//       const data = await response.json();

//       expect(response.status).toBe(404);
//       expect(data).toEqual({
//         error: "No song found with the specified ID",
//       });
//     });
//   });
// });
