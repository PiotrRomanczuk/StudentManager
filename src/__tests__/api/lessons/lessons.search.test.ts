// import { NextRequest } from 'next/server';
// import { GET } from '@/app/api/(main)/lessons/search/route';
// import { createClient } from '@/utils/supabase/clients/server';
// import { expect } from '@jest/globals';

// // Mock the Supabase client
// jest.mock('@/utils/supabase/clients/server', () => ({
//   createClient: jest.fn(),
// }));

// // Helper to create a fully thenable mock query chain
// function createThenableQueryChain(data: any, error: any = null, count: number = 0) {
//   const chain: any = {
//     select: jest.fn().mockReturnThis(),
//     or: jest.fn().mockReturnThis(),
//     eq: jest.fn().mockReturnThis(),
//     gte: jest.fn().mockReturnThis(),
//     lte: jest.fn().mockReturnThis(),
//     order: jest.fn().mockReturnThis(),
//     range: jest.fn().mockReturnThis(),
//     // For .then chaining
//     then: undefined,
//     catch: undefined,
//     finally: undefined,
//   };
//   // Make it a real thenable
//   const promise = Promise.resolve({ data, error, count });
//   chain.then = promise.then.bind(promise);
//   chain.catch = promise.catch.bind(promise);
//   chain.finally = promise.finally.bind(promise);
//   return chain;
// }

// describe('/api/lessons/search', () => {
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

//   describe('GET /api/lessons/search', () => {
//     it('should return lessons with basic search', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessons = [
//         {
//           id: 'lesson-1',
//           title: 'Guitar Basics',
//           student_id: 'student-1',
//           teacher_id: 'teacher-1',
//           date: '2024-01-15T10:00:00Z',
//           status: 'SCHEDULED',
//           profile: {
//             email: 'student@example.com',
//             firstName: 'John',
//             lastName: 'Doe'
//           },
//           teacher_profile: {
//             email: 'teacher@example.com',
//             firstName: 'Jane',
//             lastName: 'Smith'
//           }
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons, null, 1));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search?q=guitar');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessons).toEqual(mockLessons);
//       expect(data.total).toBe(1);
//       expect(data.limit).toBe(20);
//       expect(data.offset).toBe(0);
//       expect(data.hasMore).toBe(false);
//     });

//     it('should filter by status', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessons = [
//         {
//           id: 'lesson-1',
//           title: 'Guitar Basics',
//           student_id: 'student-1',
//           teacher_id: 'teacher-1',
//           date: '2024-01-15T10:00:00Z',
//           status: 'SCHEDULED'
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons, null, 1));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search?status=SCHEDULED');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessons).toEqual(mockLessons);
//     });

//     it('should filter by student ID', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessons = [
//         {
//           id: 'lesson-1',
//           title: 'Guitar Basics',
//           student_id: 'student-1',
//           teacher_id: 'teacher-1',
//           date: '2024-01-15T10:00:00Z',
//           status: 'SCHEDULED'
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons, null, 1));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search?studentId=student-1');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessons).toEqual(mockLessons);
//     });

//     it('should filter by teacher ID', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessons = [
//         {
//           id: 'lesson-1',
//           title: 'Guitar Basics',
//           student_id: 'student-1',
//           teacher_id: 'teacher-1',
//           date: '2024-01-15T10:00:00Z',
//           status: 'SCHEDULED'
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons, null, 1));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search?teacherId=teacher-1');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessons).toEqual(mockLessons);
//     });

//     it('should filter by date range', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessons = [
//         {
//           id: 'lesson-1',
//           title: 'Guitar Basics',
//           student_id: 'student-1',
//           teacher_id: 'teacher-1',
//           date: '2024-01-15T10:00:00Z',
//           status: 'SCHEDULED'
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons, null, 1));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search?dateFrom=2024-01-01&dateTo=2024-01-31');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessons).toEqual(mockLessons);
//     });

//     it('should sort by different fields', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessons = [
//         {
//           id: 'lesson-1',
//           title: 'Guitar Basics',
//           student_id: 'student-1',
//           teacher_id: 'teacher-1',
//           date: '2024-01-15T10:00:00Z',
//           status: 'SCHEDULED'
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons, null, 1));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search?sortBy=title&sortOrder=asc');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessons).toEqual(mockLessons);
//     });

//     it('should handle pagination', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessons = [
//         {
//           id: 'lesson-1',
//           title: 'Guitar Basics',
//           student_id: 'student-1',
//           teacher_id: 'teacher-1',
//           date: '2024-01-15T10:00:00Z',
//           status: 'SCHEDULED'
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons, null, 1));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search?limit=10&offset=0');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessons).toEqual(mockLessons);
//       expect(data.limit).toBe(10);
//       expect(data.offset).toBe(0);
//     });

//     it('should return 400 for invalid status filter', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       // Mock the query chain even though it shouldn't be called
//       mockSupabase.from.mockReturnValue(createThenableQueryChain([], null, 0));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search?status=INVALID_STATUS');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(400);
//       expect(data.error).toBe('Invalid status filter');
//     });

//     it('should return 401 when user is not authenticated', async () => {
//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: null },
//         error: null,
//       });

//       const request = new NextRequest('http://localhost:3000/api/lessons/search');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(401);
//       expect(data.error).toBe('Unauthorized');
//     });

//     it('should handle multiple filters together', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };
//       const mockLessons = [
//         {
//           id: 'lesson-1',
//           title: 'Guitar Basics',
//           student_id: 'student-1',
//           teacher_id: 'teacher-1',
//           date: '2024-01-15T10:00:00Z',
//           status: 'SCHEDULED'
//         }
//       ];

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(mockLessons, null, 1));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search?q=guitar&status=SCHEDULED&studentId=student-1&sortBy=date&sortOrder=asc&limit=10&offset=0');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessons).toEqual(mockLessons);
//     });

//     it('should handle empty results', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain([], null, 0));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search?q=nonexistent');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessons).toEqual([]);
//       expect(data.total).toBe(0);
//       expect(data.hasMore).toBe(false);
//     });

//     it('should handle database errors', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createThenableQueryChain(null, { message: 'Database error' }));

//       const request = new NextRequest('http://localhost:3000/api/lessons/search');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data.error).toBe('Database error');
//     });
//   });
// });
