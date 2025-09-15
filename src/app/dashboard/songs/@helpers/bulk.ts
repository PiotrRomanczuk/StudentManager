import { BASE_URL } from "@/constants/BASE_URL";
import { fetchApi } from "../../../../utils/api-helpers";
import { Song } from "@/types/Song";
import { BulkImportResult, ValidationResult } from "./types";

/**
 * Bulk import songs
 */
export async function bulkImportSongs(
  songs: Partial<Song>[],
  options?: { overwrite?: boolean; validate_only?: boolean }
): Promise<BulkImportResult | ValidationResult> {
  const url = `${BASE_URL}/api/song/bulk`;
  return fetchApi<BulkImportResult | ValidationResult>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      songs,
      overwrite: options?.overwrite || false,
      validate_only: options?.validate_only || false,
    }),
  });
}

/**
 * Bulk delete songs (admin only)
 */
export async function bulkDeleteSongs(songIds: string[]): Promise<{ success: boolean; deleted_count: number }> {
  const url = new URL(`${BASE_URL}/api/song/bulk`);
  url.searchParams.append("ids", songIds.join(","));
  return fetchApi<{ success: boolean; deleted_count: number }>(url.toString(), { method: "DELETE" });
}