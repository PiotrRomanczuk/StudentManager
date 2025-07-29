export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function fetchApi<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  try {
    console.log(`Making API request to: ${url}`);
    
    const response = await fetch(url, options);
    
    console.log(`Response status: ${response.status}`);
    
    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      throw new APIError(
        `Invalid response format: ${response.statusText}`,
        response.status,
      );
    }

    if (!response.ok) {
      console.error(`API Error ${response.status}:`, data);
      throw new APIError(
        data.message || data.error || "An error occurred",
        response.status,
        data.code,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      console.error("API Error:", error.message, error.status);
      throw error;
    }
    
    console.error("Network error:", error);
    throw new APIError("Network error", 500);
  }
}
