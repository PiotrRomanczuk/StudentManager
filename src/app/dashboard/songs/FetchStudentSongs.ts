import { createClient } from "@/utils/supabase/clients/server";
import { Song } from "@/types/Song";

interface StudentSong {
  song_id: string;
  song_status: string;
}
 
type SongStatus = "to learn" | "started" | "remembered" | "with author" | "mastered";

export async function getSongsByStudent(studentId: string): Promise<Song[] | null> {
  try {
    const supabase = await createClient();
    const { data: studentSongsID, error } = await supabase.rpc("get_songs_by_student", {
      p_student_id: studentId,
    });

    if (error) {
      console.error("Error fetching student songs:", error);
      return null;
    }

    if (!studentSongsID || studentSongsID.length === 0) {
  
      return [];
    }

    const { data: songs, error: songsError } = await supabase
      .from("songs")
      .select("*")
      .in("id", studentSongsID.map((song: StudentSong) => song.song_id));

    if (songsError) {
      console.error("Error fetching songs details:", songsError);
      return null;
    }

    // Create a map of song_id to status for quick lookup
    const statusMap = new Map(
      studentSongsID.map((song: StudentSong) => [song.song_id, song.song_status as SongStatus])
    );

    // Merge songs with their status
    const songsWithStatus = songs.map((song: Song) => ({
      ...song,
      status: statusMap.get(song.id) || "to learn"
    }));



    return songsWithStatus;
  } catch (error) {
    console.error("Unexpected error while fetching songs:", error);
    return null;
  }
}
