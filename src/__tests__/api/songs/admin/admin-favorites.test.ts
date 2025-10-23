// import '@testing-library/jest-dom';
// import { NextRequest } from 'next/server';
// import { GET } from '@/app/api/(main)/song/admin-favorites/route';
// import { createClient } from '@/utils/supabase/clients/server';

// // Mock Supabase client
// const mockSupabase = {
//   from: jest.fn(),
// };

// jest.mock('@/utils/supabase/clients/server', () => ({
//   createClient: jest.fn(() => mockSupabase),
// }));

// type ChainableMock = {
//   select: jest.Mock<any, any>;
//   eq: jest.Mock<any, any>;
//   single: jest.Mock<any, any>;
//   then?: undefined;
// };

// function createChainableMock(finalResult: { data: any; error: any }): ChainableMock {
//   const chain: ChainableMock = {
//     select: jest.fn(),
//     eq: jest.fn(),
//     single: jest.fn(),
//     then: undefined,
//   };
//   chain.select.mockReturnValue(chain);
//   chain.eq.mockReturnValue(chain);
//   chain.single.mockResolvedValue(finalResult);
//   return chain;
// }

// function createFavoritesChainableMock(finalResult: { data: any; error: any }): ChainableMock {
//   const chain: ChainableMock = {
//     select: jest.fn(),
//     eq: jest.fn(),
//     single: jest.fn(), // not used, but must exist for type safety
//     then: undefined,
//   };
//   chain.select.mockReturnValue(chain);
//   let eqCallCount = 0;
//   chain.eq.mockImplementation(() => {
//     eqCallCount++;
//     if (eqCallCount === 2) {
//       return finalResult;
//     }
//     return chain;
//   });
//   chain.single.mockResolvedValue(finalResult); // fallback, not used
//   return chain;
// }

// describe('Admin Favorites API GET Operations', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return admin favorites when user is admin', async () => {
//     const mockProfile = { isAdmin: true };
//     const mockFavorites = [
//       { song: { id: 'song1', title: 'Song 1', author: 'Artist 1' } },
//       { song: { id: 'song2', title: 'Song 2', author: 'Artist 2' } },
//     ];

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainableMock({ data: mockProfile, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createFavoritesChainableMock({ data: mockFavorites, error: null });
//       }
//       return createChainableMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-favorites?userId=admin123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result).toHaveLength(2);
//     expect(result[0]).toEqual(mockFavorites[0].song);
//     expect(result[1]).toEqual(mockFavorites[1].song);
//   });

//   it('should return 400 when userId is missing', async () => {
//     const request = new NextRequest('http://localhost:3000/api/song/admin-favorites');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(400);
//     expect(result.error).toBe('Missing userId');
//   });

//   it('should return 403 when user is not admin', async () => {
//     const mockProfile = { isAdmin: false };

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainableMock({ data: mockProfile, error: null });
//       }
//       return createChainableMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-favorites?userId=user123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(403);
//     expect(result.error).toBe('User is not an admin');
//   });

//   it('should return 500 when profile fetch fails', async () => {
//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainableMock({ data: null, error: { message: 'Database error' } });
//       }
//       return createChainableMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-favorites?userId=user123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(500);
//     expect(result.error).toBe('Error fetching user profile');
//   });

//   it('should return 500 when favorites fetch fails', async () => {
//     const mockProfile = { isAdmin: true };

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainableMock({ data: mockProfile, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createFavoritesChainableMock({ data: null, error: { message: 'Database error' } });
//       }
//       return createChainableMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-favorites?userId=admin123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(500);
//     expect(result.error).toBe('Error fetching songs: Database error');
//   });

//   it('should return empty array when no favorites found', async () => {
//     const mockProfile = { isAdmin: true };

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainableMock({ data: mockProfile, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createFavoritesChainableMock({ data: [], error: null });
//       }
//       return createChainableMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-favorites?userId=admin123');
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
//         return createChainableMock({ data: mockProfile, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createFavoritesChainableMock({ data: mockFavorites, error: null });
//       }
//       return createChainableMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/admin-favorites?userId=admin123');
//     const response = await GET(request);
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result).toHaveLength(3);
//     expect(result[0]).toEqual(mockFavorites[0].song);
//     expect(result[1]).toBeNull();
//     expect(result[2]).toEqual(mockFavorites[2].song);
//   });
// });
