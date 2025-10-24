// import '@testing-library/jest-dom';
// import { NextRequest } from 'next/server';
// import { GET } from '@/app/api/(main)/song/[id]/route';
// import { createClient } from '@/utils/supabase/clients/server';

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
//   return chain;
// };

// describe('Song by ID API GET Operations', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return a song when it exists', async () => {
//     const mockSong = {
//       id: 'song123',
//       title: 'Test Song',
//       author: 'Test Artist',
//       level: 'beginner',
//       key: 'C',
//       chords: 'C, F, G',
//     };

//     // Mock authentication
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: { id: 'user123', email: 'test@example.com' } },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation(() =>
//       createChainedMock({ data: mockSong, error: null })
//     );

//     const request = new NextRequest('http://localhost:3000/api/song/song123');
//     const params = Promise.resolve({ id: 'song123' });
//     const response = await GET(request, { params });
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result).toEqual(mockSong);
//     expect(mockSupabase.from).toHaveBeenCalledWith('songs');
//   });

//   it('should return 404 when song is not found', async () => {
//     // Mock authentication
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: { id: 'user123', email: 'test@example.com' } },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation(() =>
//       createChainedMock({ data: null, error: { message: 'No rows returned' } })
//     );

//     const request = new NextRequest('http://localhost:3000/api/song/nonexistent');
//     const params = Promise.resolve({ id: 'nonexistent' });
//     const response = await GET(request, { params });
//     const result = await response.json();

//     expect(response.status).toBe(404);
//     expect(result.error).toBe('Song not found');
//   });

//   it('should return 404 when database returns error', async () => {
//     // Mock authentication
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: { id: 'user123', email: 'test@example.com' } },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation(() =>
//       createChainedMock({ data: null, error: { message: 'Database error' } })
//     );

//     const request = new NextRequest('http://localhost:3000/api/song/song123');
//     const params = Promise.resolve({ id: 'song123' });
//     const response = await GET(request, { params });
//     const result = await response.json();

//     expect(response.status).toBe(404);
//     expect(result.error).toBe('Song not found');
//   });

//   it('should handle database connection errors', async () => {
//     // Mock authentication
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: { id: 'user123', email: 'test@example.com' } },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation(() => {
//       throw new Error('Database connection failed');
//     });

//     const request = new NextRequest('http://localhost:3000/api/song/song123');
//     const params = Promise.resolve({ id: 'song123' });
//     const response = await GET(request, { params });
//     const result = await response.json();

//     expect(response.status).toBe(500);
//     expect(result.error).toBe('Internal server error');
//   });

//   it('should handle empty song data', async () => {
//     // Mock authentication
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: { id: 'user123', email: 'test@example.com' } },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation(() =>
//       createChainedMock({ data: null, error: null })
//     );

//     const request = new NextRequest('http://localhost:3000/api/song/song123');
//     const params = Promise.resolve({ id: 'song123' });
//     const response = await GET(request, { params });
//     const result = await response.json();

//     expect(response.status).toBe(404);
//     expect(result.error).toBe('Song not found');
//   });

//   it('should handle malformed song data', async () => {
//     // Mock authentication
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: { id: 'user123', email: 'test@example.com' } },
//       error: null,
//     });

//     const malformedSong = {
//       id: 'song123',
//       // Missing required fields
//     };

//     mockSupabase.from.mockImplementation(() =>
//       createChainedMock({ data: malformedSong, error: null })
//     );

//     const request = new NextRequest('http://localhost:3000/api/song/song123');
//     const params = Promise.resolve({ id: 'song123' });
//     const response = await GET(request, { params });
//     const result = await response.json();

//     expect(response.status).toBe(200);
//     expect(result).toEqual(malformedSong);
//   });
// });
