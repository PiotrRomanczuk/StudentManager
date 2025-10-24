// import '@testing-library/jest-dom';
// import { NextRequest } from 'next/server';
// import { POST } from '@/app/api/(main)/song/route';
// import { createClient } from '@/utils/supabase/clients/server';
// import { expect } from '@jest/globals';

// // Mock Supabase client
// const mockSupabase = {
//   from: jest.fn(),
//   auth: {
//     getUser: jest.fn(),
//   },
// };

// jest.mock('@/utils/supabase/clients/server', () => ({
//   createClient: jest.fn(() => mockSupabase),
// }));

// describe('Songs API POST Operations', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should create a new song successfully', async () => {
//     const mockUser = { id: 'user123', email: 'test@example.com' };
//     const mockProfile = { isAdmin: true, isTeacher: false };
//     const songData = {
//       title: 'Test Song',
//       author: 'Test Artist',
//       level: 'intermediate',
//       key: 'C',
//       ultimate_guitar_link: 'https://example.com',
//     };

//     mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return {
//           select: jest.fn().mockReturnThis(),
//           eq: jest.fn().mockReturnThis(),
//           single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
//         };
//       }
//       if (table === 'songs') {
//         return {
//           insert: jest.fn().mockReturnThis(),
//           select: jest.fn().mockReturnThis(),
//           single: jest.fn().mockResolvedValue({ data: { id: 'song123', ...songData }, error: null }),
//         };
//       }
//       return {};
//     });

//     const request = new NextRequest('http://localhost:3000/api/song', {
//       method: 'POST',
//       body: JSON.stringify(songData),
//     });

//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result.title).toBe(songData.title);
//     expect(result.author).toBe(songData.author);
//   });

//   it('should return 401 when user is not authenticated', async () => {
//     mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

//     const request = new NextRequest('http://localhost:3000/api/song', {
//       method: 'POST',
//       body: JSON.stringify({ title: 'Test Song' }),
//     });

//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(401);
//     expect(result.error).toBe('Unauthorized');
//   });

//   it('should return 403 when user is not admin or teacher', async () => {
//     const mockUser = { id: 'user123', email: 'test@example.com' };
//     const mockProfile = { isAdmin: false, isTeacher: false };

//     mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return {
//           select: jest.fn().mockReturnThis(),
//           eq: jest.fn().mockReturnThis(),
//           single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
//         };
//       }
//       return {};
//     });

//     const request = new NextRequest('http://localhost:3000/api/song', {
//       method: 'POST',
//       body: JSON.stringify({ title: 'Test Song' }),
//     });

//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(403);
//     expect(result.error).toBe('Forbidden');
//   });

//   it('should return 400 for invalid song data', async () => {
//     const mockUser = { id: 'user123', email: 'test@example.com' };
//     const mockProfile = { isAdmin: true, isTeacher: false };

//     mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return {
//           select: jest.fn().mockReturnThis(),
//           eq: jest.fn().mockReturnThis(),
//           single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
//         };
//       }
//       return {};
//     });

//     const request = new NextRequest('http://localhost:3000/api/song', {
//       method: 'POST',
//       body: JSON.stringify({ title: '' }), // Invalid: empty title
//     });

//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(400);
//     expect(result.error).toBeDefined();
//   });

//   it('should return 500 when database insert fails', async () => {
//     const mockUser = { id: 'user123', email: 'test@example.com' };
//     const mockProfile = { isAdmin: true, isTeacher: false };
//     const songData = {
//       title: 'Test Song',
//       author: 'Test Artist',
//       level: 'intermediate',
//       key: 'C',
//       ultimate_guitar_link: 'https://example.com',
//     };

//     mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return {
//           select: jest.fn().mockReturnThis(),
//           eq: jest.fn().mockReturnThis(),
//           single: jest.fn().mockResolvedValue({ data: mockProfile, error: null }),
//         };
//       }
//       if (table === 'songs') {
//         return {
//           insert: jest.fn().mockReturnThis(),
//           select: jest.fn().mockReturnThis(),
//           single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
//         };
//       }
//       return {};
//     });

//     const request = new NextRequest('http://localhost:3000/api/song', {
//       method: 'POST',
//       body: JSON.stringify(songData),
//     });

//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(500);
//     expect(result.error).toBe('Database error');
//   });
// });
