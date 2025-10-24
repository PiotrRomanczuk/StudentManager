// import '@testing-library/jest-dom';
// import { NextRequest } from 'next/server';
// import { GET } from '@/app/api/(main)/song/admin-songs/route';
// import { createClient } from '@/utils/supabase/clients/server';

// // Mock Supabase client
// const mockSupabase = {
//   from: jest.fn(),
// };

// jest.mock('@/utils/supabase/clients/server', () => ({
//   createClient: jest.fn(() => mockSupabase),
// }));

// const createChainedMock = (returnValue: any) => {
//   const chain = {} as any;
//   chain.select = jest.fn(() => chain);
//   chain.eq = jest.fn(() => chain);
//   chain.single = jest.fn(() => Promise.resolve(returnValue));
//   return chain;
// };

// const createUserFavoritesMock = (returnValue: any) => {
//   const chain = {} as any;
//   chain.select = jest.fn(() => chain);
//   chain.eq = jest.fn(() => Promise.resolve(returnValue));
//   return chain;
// };

// describe('Admin Songs API GET Operations', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return target user songs when current user is admin', async () => {
//     const mockProfile = { isAdmin: true };
//     const mockFavorites = [
//       { song: { id: 'song1', title: 'Song 1', author: 'Artist 1' } },
//       { song: { id: 'song2', title: 'Song 2', author: 'Artist 2' } },
//     ];

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createUserFavoritesMock({ data: mockFavorites, error: null });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-songs?currentUserId=admin123&targetUserId=user123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result).toHaveLength(2);
//     expect(result[0]).toEqual(mockFavorites[0].song);
//     expect(result[1]).toEqual(mockFavorites[1].song);
//   });

//   it('should return 400 when currentUserId is missing', async () => {
//     const request = new NextRequest('http://localhost:3000/api/song/admin-songs?targetUserId=user123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(400);
//     expect(result.error).toBe('Missing currentUserId or targetUserId');
//   });

//   it('should return 400 when targetUserId is missing', async () => {
//     const request = new NextRequest('http://localhost:3000/api/song/admin-songs?currentUserId=admin123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(400);
//     expect(result.error).toBe('Missing currentUserId or targetUserId');
//   });

//   it('should return 403 when current user is not admin', async () => {
//     const mockProfile = { isAdmin: false };

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-songs?currentUserId=user123&targetUserId=user456');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(403);
//     expect(result.error).toBe('User is not an admin');
//   });

//   it('should return 500 when profile fetch fails', async () => {
//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: null, error: { message: 'Database error' } });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-songs?currentUserId=admin123&targetUserId=user123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(500);
//     expect(result.error).toBe('Error fetching user profile');
//   });

//   it('should return 500 when favorites fetch fails', async () => {
//     const mockProfile = { isAdmin: true };

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createUserFavoritesMock({ data: null, error: { message: 'Database error' } });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-songs?currentUserId=admin123&targetUserId=user123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(500);
//     expect(result.error).toBe('Error fetching songs: Database error');
//   });

//   it('should return empty array when target user has no favorites', async () => {
//     const mockProfile = { isAdmin: true };

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createUserFavoritesMock({ data: [], error: null });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-songs?currentUserId=admin123&targetUserId=user123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result).toEqual([]);
//   });

//   it('should handle malformed favorite data', async () => {
//     const mockProfile = { isAdmin: true };
//     const mockFavorites = [
//       { song: { id: 'song1', title: 'Song 1' } },
//       { song: null }, // Malformed data
//       { song: { id: 'song2', title: 'Song 2' } },
//     ];

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createUserFavoritesMock({ data: mockFavorites, error: null });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-songs?currentUserId=admin123&targetUserId=user123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result).toHaveLength(3);
//     expect(result[0]).toEqual(mockFavorites[0].song);
//     expect(result[1]).toBeNull();
//     expect(result[2]).toEqual(mockFavorites[2].song);
//   });
// });
