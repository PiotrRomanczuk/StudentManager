import { fetchApi } from "@/utils/api-helpers";
import { Song } from "@/types/Song";

type SongStatus = "to learn" | "started" | "remembered" | "with author" | "mastered";

interface ApiResponse {
  songs: (Song & { status: SongStatus })[];
  total: number;
}

export async function getSongsByStudent(studentId: string): Promise<Song[] | null> {
  try {
    const response = await fetchApi<ApiResponse>(`/api/song/student-songs?studentId=${encodeURIComponent(studentId)}`);
    
    return response.songs;
  } catch (error) {
    console.error("Error fetching student songs:", error);
    return null;
  }
}
