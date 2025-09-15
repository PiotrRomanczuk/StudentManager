/**
 * Generates a short title from a normal title
 * @param title - The full title of the song
 * @returns A short title with spaces trimmed and words connected with hyphens
 */
export function generateShortTitle(title: string): string {
  if (!title) return '';
  
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
    .replace(/[^a-z0-9-]/g, '') // Remove any characters that aren't letters, numbers, or hyphens
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Generates a short title with a maximum length
 * @param title - The full title of the song
 * @param maxLength - Maximum length for the short title (default: 50)
 * @returns A short title that doesn't exceed the maximum length
 */
export function generateShortTitleWithMaxLength(title: string, maxLength: number = 50): string {
  const shortTitle = generateShortTitle(title);
  
  if (shortTitle.length <= maxLength) {
    return shortTitle;
  }
  
  // Truncate to max length, but try to break at a hyphen
  const truncated = shortTitle.substring(0, maxLength);
  const lastHyphenIndex = truncated.lastIndexOf('-');
  
  if (lastHyphenIndex > maxLength * 0.7) { // If hyphen is in the last 30% of the string
    return truncated.substring(0, lastHyphenIndex);
  }
  
  return truncated;
}

/**
 * Validates if a short title is properly formatted
 * @param shortTitle - The short title to validate
 * @returns true if the short title is valid
 */
export function isValidShortTitle(shortTitle: string): boolean {
  if (!shortTitle) return true; // Empty is valid (optional field)
  
  // Check if it only contains lowercase letters, numbers, and hyphens
  const validPattern = /^[a-z0-9-]+$/;
  return validPattern.test(shortTitle);
} 