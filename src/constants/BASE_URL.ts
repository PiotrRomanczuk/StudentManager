// For server-side API calls, we need to use the same domain
// In development, always use localhost regardless of NEXT_PUBLIC_BASE_URL
export const BASE_URL = process.env.NODE_ENV === 'development' 
  ? "http://localhost:3000"
  : (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");
