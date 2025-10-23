// import '@testing-library/jest-dom';
// import { NextRequest } from 'next/server';
// import { POST } from '@/app/api/(main)/song/favorites/route';
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

// const createChainedMock = (returnValue: any) => {
//   const chain = {} as any;
//   chain.select = jest.fn(() => chain);
//   chain.eq = jest.fn(() => chain);
//   chain.single = jest.fn(() => Promise.resolve(returnValue));
//   chain.insert = jest.fn(() => chain);
//   chain.delete = jest.fn(() => chain);
//   chain.order = jest.fn(() => chain);
//   chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue));
//   return chain;
// };

// describe('Song Favorites API POST Operations', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should add song to favorites successfully', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'user@example.com' };
//     const mockProfile = { role: 'user' };
//     const favoriteData = {
//       user_id: '550e8400-e29b-41d4-a716-446655440000',
//       song_id: '550e8400-e29b-41d4-a716-446655440001',
//     };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     let callCount = 0;
//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'songs') {
//         return createChainedMock({ data: { id: '550e8400-e29b-41d4-a716-446655440001' }, error: null });
//       }
//       if (table === 'user_favorites') {
//         callCount++;
//         if (callCount === 1) {
//           // First call: check if favorite exists
//           return createChainedMock({ data: null, error: null });
//         }
//         if (callCount === 2) {
//           // Second call: insert new favorite
//           return createChainedMock({
//             data: {
//               id: 'fav1',
//               user_id: '550e8400-e29b-41d4-a716-446655440000',
//               song_id: '550e8400-e29b-41d4-a716-446655440001',
//               song: { id: '550e8400-e29b-41d4-a716-446655440001', title: 'Song 1' }
//             },
//             error: null
//           });
//         }
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/favorites', {
//       method: 'POST',
//       body: JSON.stringify(favoriteData),
//     });
//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result.user_id).toBe('550e8400-e29b-41d4-a716-446655440000');
//     expect(result.song_id).toBe('550e8400-e29b-41d4-a716-446655440001');
//   });

//   it('should return 401 when user is not authenticated', async () => {
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: null },
//       error: null,
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/favorites', {
//       method: 'POST',
//       body: JSON.stringify({ user_id: 'user123', song_id: 'song1' }),
//     });

//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(401);
//     expect(result.error).toBe('Unauthorized');
//   });

//   it('should return 403 when user tries to add favorite for another user', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'user@example.com' };
//     const mockProfile = { role: 'user' };
//     const favoriteData = {
//       user_id: '550e8400-e29b-41d4-a716-446655440002', // Different user
//       song_id: '550e8400-e29b-41d4-a716-446655440001',
//     };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/favorites', {
//       method: 'POST',
//       body: JSON.stringify(favoriteData),
//     });
//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(403);
//     expect(result.error).toBe('Forbidden');
//   });

//   it('should return 404 when song does not exist', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'user@example.com' };
//     const mockProfile = { role: 'user' };
//     const favoriteData = {
//       user_id: '550e8400-e29b-41d4-a716-446655440000',
//       song_id: '550e8400-e29b-41d4-a716-446655440001',
//     };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'songs') {
//         return createChainedMock({ data: null, error: null }); // Song not found
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/favorites', {
//       method: 'POST',
//       body: JSON.stringify(favoriteData),
//     });
//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(404);
//     expect(result.error).toBe('Song not found');
//   });

//   it('should return 409 when song is already in favorites', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'user@example.com' };
//     const mockProfile = { role: 'user' };
//     const favoriteData = {
//       user_id: '550e8400-e29b-41d4-a716-446655440000',
//       song_id: '550e8400-e29b-41d4-a716-446655440001',
//     };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'songs') {
//         return createChainedMock({ data: { id: '550e8400-e29b-41d4-a716-446655440001' }, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createChainedMock({ data: { id: 'existing-fav' }, error: null }); // Favorite already exists
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/favorites', {
//       method: 'POST',
//       body: JSON.stringify(favoriteData),
//     });
//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(409);
//     expect(result.error).toBe('Song is already in favorites');
//   });

//   it('should handle database errors', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'user@example.com' };
//     const mockProfile = { role: 'user' };
//     const favoriteData = {
//       user_id: '550e8400-e29b-41d4-a716-446655440000',
//       song_id: '550e8400-e29b-41d4-a716-446655440001',
//     };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'songs') {
//         return createChainedMock({ data: { id: '550e8400-e29b-41d4-a716-446655440001' }, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createChainedMock({ data: null, error: { message: 'Database error' } });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/favorites', {
//       method: 'POST',
//       body: JSON.stringify(favoriteData),
//     });
//     const response = await POST(request);
//     const result = await response.json();

//     expect(response.status).toBe(500);
//     expect(result.error).toBe('Database error');
//   });
// });
