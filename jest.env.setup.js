// Force NODE_ENV to be 'test' for all Jest tests
// This ensures React Testing Library works properly
process.env.NODE_ENV = 'test';

// Also set other common test environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000'; 