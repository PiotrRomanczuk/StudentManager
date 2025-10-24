// import '@testing-library/jest-dom';
// import { NextRequest } from 'next/server';
// import { DELETE } from '@/app/api/(main)/song/favorites/route';
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

// describe('Song Favorites API DELETE Operations', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should remove song from favorites successfully', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'user@example.com' };
//     const mockProfile = { role: 'user' };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createChainedMock({ data: null, error: null });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/favorites?userId=550e8400-e29b-41d4-a716-446655440000&songId=550e8400-e29b-41d4-a716-446655440001');
//     const response = await DELETE(request);
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result.success).toBe(true);
//   });

//   it('should return 400 when userId or songId is missing', async () => {
//     const request = new NextRequest('http://localhost:3000/api/song/favorites?userId=550e8400-e29b-41d4-a716-446655440000');
//     const response = await DELETE(request);
//     const result = await response.json();

//     expect(response.status).toBe(400);
//     expect(result.error).toBe('User ID and Song ID are required');
//   });

//   it('should return 401 when user is not authenticated', async () => {
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: null },
//       error: null,
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/favorites?userId=550e8400-e29b-41d4-a716-446655440000&songId=550e8400-e29b-41d4-a716-446655440001');
//     const response = await DELETE(request);
//     const result = await response.json();

//     expect(response.status).toBe(401);
//     expect(result.error).toBe('Unauthorized');
//   });

//   it('should return 403 when user tries to remove favorite for another user', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'user@example.com' };
//     const mockProfile = { role: 'user' };

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

//     const request = new NextRequest('http://localhost:3000/api/song/favorites?userId=550e8400-e29b-41d4-a716-446655440002&songId=550e8400-e29b-41d4-a716-446655440001');
//     const response = await DELETE(request);
//     const result = await response.json();

//     expect(response.status).toBe(403);
//     expect(result.error).toBe('Forbidden');
//   });

//   it('should handle database errors', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'user@example.com' };
//     const mockProfile = { role: 'user' };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'user_favorites') {
//         return createChainedMock({ data: null, error: { message: 'Database error' } });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/favorites?userId=550e8400-e29b-41d4-a716-446655440000&songId=550e8400-e29b-41d4-a716-446655440001');
//     const response = await DELETE(request);
//     const result = await response.json();

//     expect(response.status).toBe(500);
//     expect(result.error).toBe('Database error');
//   });
// });
