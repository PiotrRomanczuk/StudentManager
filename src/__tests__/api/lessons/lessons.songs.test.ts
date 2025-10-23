// import { NextRequest } from 'next/server';
// import { GET, POST } from '@/app/api/(main)/lessons/songs/route';
// import { createClient } from '@/utils/supabase/clients/server';
// import { expect } from '@jest/globals';

// // Mock the Supabase client
// jest.mock('@/utils/supabase/clients/server', () => ({
//   createClient: jest.fn(),
// }));

// // Helper to create a fully thenable mock query chain
// function createThenableQueryChain(data: any, error: any = null) {
//   const chain: any = {
//     select: jest.fn().mockReturnThis(),
//     eq: jest.fn().mockReturnThis(),
//     insert: jest.fn().mockReturnThis(),
//     single: jest.fn().mockReturnThis(),
//     // For .then chaining
//     then: undefined,
//     catch: undefined,
//     finally: undefined,
//   };
//   // Make it a real thenable
//   const promise = Promise.resolve({ data, error });
//   chain.then = promise.then.bind(promise);
//   chain.catch = promise.catch.bind(promise);
//   chain.finally = promise.finally.bind(promise);
//   return chain;
// }

// describe('/api/lessons/songs', () => {
//   let mockSupabase: any;

//   beforeEach(() => {
//     mockSupabase = {
//       auth: {
//         getUser: jest.fn(),
//       },
//       from: jest.fn(),
//     };
//     (createClient as jest.Mock).mockResolvedValue(mockSupabase);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('GET /api/lessons/songs', () => {
//     it('should return lesson songs when lessonId is provided', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessonSongs = [
//         {
//           id: 'song-assignment-1',
//           lesson_id: '550e8400-e29b-41d4-a716-446655440000',
//           song_id: '550e8400-e29b-41d4-a716-446655440001',
//           song_status: 'started',
//           student_id: '550e8400-e29b-41d4-a716-446655440002',
//           song: {
//             title: 'Wonderwall',
//             author: 'Oasis',
//             level: 'intermediate',
//             key: 'C'
//           },
//           lesson: {
//             title: 'Guitar Basics',
//             date: '2024-01-15T10:00:00Z',
//             status: 'SCHEDULED'
//           }
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessonSongs));

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs?lessonId=550e8400-e29b-41d4-a716-446655440000');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessonSongs).toEqual(mockLessonSongs);
//     });

//     it('should return 400 when lessonId is not provided', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(400);
//       expect(data.error).toBe('Lesson ID is required');
//     });

//     it('should filter by songId when provided', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessonSongs = [
//         {
//           id: 'song-assignment-1',
//           lesson_id: '550e8400-e29b-41d4-a716-446655440000',
//           song_id: '550e8400-e29b-41d4-a716-446655440001',
//           song_status: 'started',
//           student_id: '550e8400-e29b-41d4-a716-446655440002'
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessonSongs));

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs?lessonId=550e8400-e29b-41d4-a716-446655440000&songId=550e8400-e29b-41d4-a716-446655440001');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessonSongs).toEqual(mockLessonSongs);
//     });

//     it('should filter by studentId when provided', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessonSongs = [
//         {
//           id: 'song-assignment-1',
//           lesson_id: '550e8400-e29b-41d4-a716-446655440000',
//           song_id: '550e8400-e29b-41d4-a716-446655440001',
//           song_status: 'started',
//           student_id: '550e8400-e29b-41d4-a716-446655440002'
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessonSongs));

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs?lessonId=550e8400-e29b-41d4-a716-446655440000&studentId=550e8400-e29b-41d4-a716-446655440002');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessonSongs).toEqual(mockLessonSongs);
//     });
//   });

//   describe('POST /api/lessons/songs', () => {
//     it('should create a lesson song assignment successfully', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockProfile = { role: 'teacher' };
//       const mockLesson = { id: '550e8400-e29b-41d4-a716-446655440000' };
//       const mockSong = { id: '550e8400-e29b-41d4-a716-446655440001' };
//       const mockLessonSong = {
//         id: 'assignment-1',
//         lesson_id: '550e8400-e29b-41d4-a716-446655440000',
//         song_id: '550e8400-e29b-41d4-a716-446655440001',
//         song_status: 'started',
//         student_id: '550e8400-e29b-41d4-a716-446655440002'
//       };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       // Mock profile check
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockProfile));
//       // Mock lesson check
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockLesson));
//       // Mock song check
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockSong));
//       // Mock existing assignment check (should return null)
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(null));
//       // Mock lesson song creation
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockLessonSong));

//       const requestBody = {
//         lesson_id: '550e8400-e29b-41d4-a716-446655440000',
//         song_id: '550e8400-e29b-41d4-a716-446655440001',
//         song_status: 'started',
//         student_id: '550e8400-e29b-41d4-a716-446655440002'
//       };

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs', {
//         method: 'POST',
//         body: JSON.stringify(requestBody),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data).toEqual(mockLessonSong);
//     });

//     it('should return 401 when user is not authenticated', async () => {
//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: null },
//         error: null,
//       });

//       const requestBody = {
//         lesson_id: '550e8400-e29b-41d4-a716-446655440000',
//         song_id: '550e8400-e29b-41d4-a716-446655440001',
//         song_status: 'started',
//         student_id: '550e8400-e29b-41d4-a716-446655440002'
//       };

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs', {
//         method: 'POST',
//         body: JSON.stringify(requestBody),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(401);
//       expect(data.error).toBe('Unauthorized');
//     });

//     it('should return 403 when user does not have permission', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockProfile = { role: 'student' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

//       const requestBody = {
//         lesson_id: '550e8400-e29b-41d4-a716-446655440000',
//         song_id: '550e8400-e29b-41d4-a716-446655440001',
//         song_status: 'started',
//         student_id: '550e8400-e29b-41d4-a716-446655440002'
//       };

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs', {
//         method: 'POST',
//         body: JSON.stringify(requestBody),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(403);
//       expect(data.error).toBe('Forbidden');
//     });

//     it('should return 404 when lesson does not exist', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockProfile = { role: 'teacher' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       // First call: profile check
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockProfile));
//       // Second call: lesson check (should return null and error)
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(null, { code: 'PGRST116' }));

//       const requestBody = {
//         lesson_id: '550e8400-e29b-41d4-a716-446655440003',
//         song_id: '550e8400-e29b-41d4-a716-446655440001',
//         song_status: 'started',
//         student_id: '550e8400-e29b-41d4-a716-446655440002'
//       };

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs', {
//         method: 'POST',
//         body: JSON.stringify(requestBody),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(404);
//       expect(data.error).toBe('Lesson not found');
//     });

//     it('should return 404 when song does not exist', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockProfile = { role: 'teacher' };
//       const mockLesson = { id: '550e8400-e29b-41d4-a716-446655440000' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockProfile));
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockLesson));
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(null, { code: 'PGRST116' }));

//       const requestBody = {
//         lesson_id: '550e8400-e29b-41d4-a716-446655440000',
//         song_id: '550e8400-e29b-41d4-a716-446655440003',
//         song_status: 'started',
//         student_id: '550e8400-e29b-41d4-a716-446655440002'
//       };

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs', {
//         method: 'POST',
//         body: JSON.stringify(requestBody),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(404);
//       expect(data.error).toBe('Song not found');
//     });

//     it('should return 409 when song is already assigned to lesson', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockProfile = { role: 'teacher' };
//       const mockLesson = { id: '550e8400-e29b-41d4-a716-446655440000' };
//       const mockSong = { id: '550e8400-e29b-41d4-a716-446655440001' };
//       const existingAssignment = { id: 'existing-assignment' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockProfile));
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockLesson));
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(mockSong));
//       mockSupabase.from.mockReturnValueOnce(createThenableQueryChain(existingAssignment));

//       const requestBody = {
//         lesson_id: '550e8400-e29b-41d4-a716-446655440000',
//         song_id: '550e8400-e29b-41d4-a716-446655440001',
//         song_status: 'started',
//         student_id: '550e8400-e29b-41d4-a716-446655440002'
//       };

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs', {
//         method: 'POST',
//         body: JSON.stringify(requestBody),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(409);
//       expect(data.error).toBe('Song is already assigned to this lesson');
//     });

//     it('should return 400 when validation fails', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockProfile = { role: 'teacher' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

//       const requestBody = {
//         // Missing required fields
//         lesson_id: '550e8400-e29b-41d4-a716-446655440000'
//       };

//       const request = new NextRequest('http://localhost:3000/api/lessons/songs', {
//         method: 'POST',
//         body: JSON.stringify(requestBody),
//       });

//       const response = await POST(request);
//       const data = await response.json();

//       expect(response.status).toBe(400);
//       expect(data.error).toBe('Invalid lesson song data');
//     });
//   });
// });
