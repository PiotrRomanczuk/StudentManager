// import '@testing-library/jest-dom';
// import { NextRequest } from 'next/server';
// import { DELETE } from '@/app/api/(main)/song/bulk/route';
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
//   chain.update = jest.fn(() => chain);
//   chain.delete = jest.fn(() => chain);
//   chain.in = jest.fn(() => chain);
//   chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue));
//   return chain;
// };

// describe('Song Bulk API DELETE Operations', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should delete multiple songs successfully', async () => {
//     const mockUser = { id: 'admin123', email: 'admin@example.com' };
//     const mockProfile = { role: 'admin' };
//     const songIds = ['song1', 'song2', 'song3'];

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'songs') {
//         return createChainedMock({ data: null, error: null });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest(`http://localhost:3000/api/song/bulk?ids=${songIds.join(',')}`, {
//       method: 'DELETE',
//     });

//     const response = await DELETE(request);
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result.success).toBe(true);
//     expect(result.deleted_count).toBe(3);
//   });

//   it('should return 400 when song IDs are missing', async () => {
//     const mockUser = { id: 'admin123', email: 'admin@example.com' };
//     const mockProfile = { role: 'admin' };

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

//     const request = new NextRequest('http://localhost:3000/api/song/bulk', {
//       method: 'DELETE',
//     });

//     const response = await DELETE(request);
//     const result = await response.json();

//     expect(response.status).toBe(400);
//     expect(result.error).toBe('Song IDs are required');
//   });

//   it('should return 401 when user is not authenticated', async () => {
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: null },
//       error: null,
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/bulk?ids=song1,song2', {
//       method: 'DELETE',
//     });

//     const response = await DELETE(request);
//     const result = await response.json();

//     expect(response.status).toBe(401);
//     expect(result.error).toBe('Unauthorized');
//   });

//   it('should return 403 when user is not admin', async () => {
//     const mockUser = { id: 'user123', email: 'user@example.com' };
//     const mockProfile = { role: 'teacher' };

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

//     const request = new NextRequest('http://localhost:3000/api/song/bulk?ids=song1,song2', {
//       method: 'DELETE',
//     });

//     const response = await DELETE(request);
//     const result = await response.json();

//     expect(response.status).toBe(403);
//     expect(result.error).toBe('Forbidden');
//   });

//   it('should handle database errors during delete', async () => {
//     const mockUser = { id: 'admin123', email: 'admin@example.com' };
//     const mockProfile = { role: 'admin' };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation((table) => {
//       if (table === 'profiles') {
//         return createChainedMock({ data: mockProfile, error: null });
//       }
//       if (table === 'songs') {
//         return createChainedMock({ data: null, error: { message: 'Database error' } });
//       }
//       return createChainedMock({ data: [], error: null });
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/bulk?ids=song1,song2', {
//       method: 'DELETE',
//     });

//     const response = await DELETE(request);
//     const result = await response.json();

//     expect(response.status).toBe(500);
//     expect(result.error).toBe('Database error');
//   });
// });
