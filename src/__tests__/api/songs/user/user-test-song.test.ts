import { NextRequest } from "next/server";
import { GET } from "@/app/api/(main)/song/user-test-song/route";
import { createClient } from "@/utils/supabase/clients/server";

// Mock the Supabase client
jest.mock("@/utils/supabase/clients/server");

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe("GET /api/song/user-test-song", () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
    };
    mockCreateClient.mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when userId is provided", () => {
    it("should return songs with status for user's lessons", async () => {
      const mockLessons = [
        { id: "lesson-1" },
        { id: "lesson-2" },
      ];
      const mockLessonSongs = [
        { song_id: "song-1", song_status: "learning" },
        { song_id: "song-2", song_status: "completed" },
      ];
      const mockSongs = [
        { id: "song-1", title: "Song 1", author: "Author 1" },
        { id: "song-2", title: "Song 2", author: "Author 2" },
      ];

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            eq: jest.fn().mockResolvedValueOnce({
              data: mockLessons,
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            in: jest.fn().mockResolvedValueOnce({
              data: mockLessonSongs,
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            in: jest.fn().mockResolvedValueOnce({
              data: mockSongs,
              error: null,
            }),
          }),
        });

      const request = new NextRequest(
        "http://localhost:3000/api/song/user-test-song?userId=user-123"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([
        { id: "song-1", title: "Song 1", author: "Author 1", song_status: "learning" },
        { id: "song-2", title: "Song 2", author: "Author 2", song_status: "completed" },
      ]);
    });

    it("should return empty array when user has no lessons", async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({
            data: [],
            error: null,
          }),
        }),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/song/user-test-song?userId=user-123"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it("should return empty array when lessons have no songs", async () => {
      const mockLessons = [{ id: "lesson-1" }];

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            eq: jest.fn().mockResolvedValueOnce({
              data: mockLessons,
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            in: jest.fn().mockResolvedValueOnce({
              data: [],
              error: null,
            }),
          }),
        });

      const request = new NextRequest(
        "http://localhost:3000/api/song/user-test-song?userId=user-123"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it("should handle error when fetching lessons", async () => {
      mockSupabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({
            data: null,
            error: { message: "Database error" },
          }),
        }),
      });

      const request = new NextRequest(
        "http://localhost:3000/api/song/user-test-song?userId=user-123"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Error fetching lessons" });
    });

    it("should handle error when fetching lesson songs", async () => {
      const mockLessons = [{ id: "lesson-1" }];

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            eq: jest.fn().mockResolvedValueOnce({
              data: mockLessons,
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            in: jest.fn().mockResolvedValueOnce({
              data: null,
              error: { message: "Database error" },
            }),
          }),
        });

      const request = new NextRequest(
        "http://localhost:3000/api/song/user-test-song?userId=user-123"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Error fetching lesson songs" });
    });

    it("should handle error when fetching songs", async () => {
      const mockLessons = [{ id: "lesson-1" }];
      const mockLessonSongs = [{ song_id: "song-1", song_status: "learning" }];

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            eq: jest.fn().mockResolvedValueOnce({
              data: mockLessons,
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            in: jest.fn().mockResolvedValueOnce({
              data: mockLessonSongs,
              error: null,
            }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            in: jest.fn().mockResolvedValueOnce({
              data: null,
              error: { message: "Database error" },
            }),
          }),
        });

      const request = new NextRequest(
        "http://localhost:3000/api/song/user-test-song?userId=user-123"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: "Error fetching songs" });
    });
  });

  describe("when userId is not provided", () => {
    it("should return 400 error", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/song/user-test-song"
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Missing userId parameter" });
    });
  });
}); 