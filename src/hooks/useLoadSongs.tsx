import { useState, useEffect } from "react";
import { Song } from "@/types/Song";

const useLoadSongs = (id?: string, title?: string) => {
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        console.log("Fetching songs...");
        let url = "/api/songs";
        if (id) {
          url += `?id=${id}`;
        } else if (title) {
          url += `?title=${title}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        console.log("Raw response:", data); // Debug log

        if (!data || !data.success) {
          console.error("Invalid response format:", data);
          setError("Invalid response from server");
          setSongs([]);
          return;
        }

        if (!data.data) {
          setError("No songs found");
          setSongs([]);
          return;
        }

        // Handle both single object and array responses
        const songsData = Array.isArray(data.data) ? data.data : [data.data];

        // Filter out any null or undefined entries
        const validSongs = songsData.filter((song: Song) => song != null);

        if (validSongs.length === 0) {
          setError("No valid songs found");
          setSongs([]);
          return;
        }

        setSongs(validSongs);
        setError(null);
      } catch (error) {
        console.error("Error loading songs:", error);
        setError("Failed to load songs");
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [id, title]);

  return { loading, songs, error };
};

export default useLoadSongs;
