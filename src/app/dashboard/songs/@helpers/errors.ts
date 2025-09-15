import { APIError } from "../../../../utils/api-helpers";

/**
 * Error handling utilities
 */
export function handleSongApiError(error: unknown): string {
  console.error("Song API Error:", error);

  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        return "You are not authorized to perform this action. Please log in again.";
      case 403:
        return "You don't have permission to access this resource. Contact your administrator.";
      case 404:
        return "Song not found or API endpoint not available.";
      case 409:
        return "Song already exists with the same title and author.";
      case 500:
        return "Server error. Please try again later or contact support.";
      case 503:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return error.message || `API Error (${error.status}): An error occurred`;
    }
  }

  if (error instanceof Error) {
    if (error.message.includes("Supabase environment variables")) {
      return "Database configuration error. Please check your environment setup.";
    }
    if (error.message.includes("Network error")) {
      return "Network connection error. Please check your internet connection.";
    }
    if (error.message.includes("fetch")) {
      return "Failed to connect to the server. Please try again.";
    }
    return error.message;
  }

  return "An unexpected error occurred. Please try again or contact support.";
}