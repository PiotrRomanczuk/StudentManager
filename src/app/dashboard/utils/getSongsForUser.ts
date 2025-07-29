import { BASE_URL } from "@/constants/BASE_URL";
import { Song } from "@/types/Song";

export interface SongsForUserParams {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  key?: string;
  author?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SongsForUserResponse {
  songs: Song[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filterOptions?: {
    levels?: string[];
    keys?: string[];
    authors?: string[];
  };
}

/**
 * Get songs for the current user with pagination and filtering
 */
export async function getSongsForUser(params: SongsForUserParams = {}): Promise<SongsForUserResponse> {
  const url = new URL(`${BASE_URL}/api/song`);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting songs for user:", error);
    throw error;
  }
} 