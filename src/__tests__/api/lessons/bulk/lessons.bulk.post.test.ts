// import { NextRequest } from 'next/server';
// import { POST } from '@/app/api/(main)/lessons/bulk/route';
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
//     update: jest.fn().mockReturnThis(),
//     delete: jest.fn().mockReturnThis(),
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

// describe('POST /api/lessons/bulk', () => {
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

//   it('should create multiple lessons successfully', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
//     const mockProfile = { role: 'teacher' };
//     const mockCreatedLesson = {
//       id: '550e8400-e29b-41d4-a716-446655440001',
//       student_id: '550e8400-e29b-41d4-a716-446655440002',
//       teacher_id: '550e8400-e29b-41d4-a716-446655440003',
//       title: 'Week 1',
//       date: '2024-01-15T10:00:00Z',
//       status: 'SCHEDULED',
//       creator_user_id: '550e8400-e29b-41d4-a716-446655440000',
//       created_at: '2024-01-15T10:00:00Z',
//       updated_at: '2024-01-15T10:00:00Z'
//     };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     // Mock the from method to return different chains based on the table name
//     mockSupabase.from.mockImplementation((tableName: string) => {
//       if (tableName === 'profiles') {
//         return createThenableQueryChain(mockProfile);
//       } else if (tableName === 'lessons') {
//         // Return a chain that will be used for lesson creation
//         return createThenableQueryChain(mockCreatedLesson);
//       }
//       return createThenableQueryChain(null);
//     });

//     const requestBody = {
//       lessons: [
//         {
//           student_id: '550e8400-e29b-41d4-a716-446655440002',
//           teacher_id: '550e8400-e29b-41d4-a716-446655440003',
//           title: 'Week 1',
//           date: '2024-01-15T10:00:00Z'
//         },
//         {
//           student_id: '550e8400-e29b-41d4-a716-446655440002',
//           teacher_id: '550e8400-e29b-41d4-a716-446655440003',
//           title: 'Week 2',
//           date: '2024-01-22T10:00:00Z'
//         }
//       ]
//     };

//     const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
//       method: 'POST',
//       body: JSON.stringify(requestBody),
//     });

//     const response = await POST(request);
//     const data = await response.json();

//     expect(response.status).toBe(200);
//     expect(data.created).toHaveLength(2);
//     expect(data.total).toBe(2);
//     expect(data.success).toBe(2);
//     expect(data.failed).toBe(0);
//     expect(data.errors).toHaveLength(0);
//   });

//   it('should return 400 when lessons array is empty', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
//     const mockProfile = { role: 'teacher' };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

//     const requestBody = {
//       lessons: []
//     };

//     const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
//       method: 'POST',
//       body: JSON.stringify(requestBody),
//     });

//     const response = await POST(request);
//     const data = await response.json();

//     expect(response.status).toBe(400);
//     expect(data.error).toBe('Lessons array is required and cannot be empty');
//   });

//   it('should return 400 when lessons array exceeds limit', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
//     const mockProfile = { role: 'teacher' };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

//     const requestBody = {
//       lessons: Array(101).fill({
//         student_id: '550e8400-e29b-41d4-a716-446655440002',
//         teacher_id: '550e8400-e29b-41d4-a716-446655440003',
//         title: 'Lesson',
//         date: '2024-01-15T10:00:00Z'
//       })
//     };

//     const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
//       method: 'POST',
//       body: JSON.stringify(requestBody),
//     });

//     const response = await POST(request);
//     const data = await response.json();

//     expect(response.status).toBe(400);
//     expect(data.error).toBe('Cannot process more than 100 lessons at once');
//   });

//   it('should handle validation errors', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
//     const mockProfile = { role: 'teacher' };
//     const validLesson = {
//       id: '550e8400-e29b-41d4-a716-446655440005',
//       student_id: '550e8400-e29b-41d4-a716-446655440002',
//       teacher_id: '550e8400-e29b-41d4-a716-446655440003',
//       title: 'Week 2',
//       date: '2024-01-22T10:00:00Z',
//       status: 'SCHEDULED',
//       creator_user_id: '550e8400-e29b-41d4-a716-446655440000',
//       created_at: '2024-01-22T10:00:00Z',
//       updated_at: '2024-01-22T10:00:00Z'
//     };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockImplementation((tableName: string) => {
//       if (tableName === 'profiles') {
//         return createThenableQueryChain(mockProfile);
//       } else if (tableName === 'lessons') {
//         return {
//           insert: jest.fn().mockImplementation((data) => {
//             if (!data.student_id || !data.teacher_id) {
//               return createThenableQueryChain(null, { message: 'Validation failed' });
//             } else {
//               return createThenableQueryChain(validLesson);
//             }
//           }),
//           select: jest.fn().mockReturnThis(),
//           single: jest.fn().mockReturnThis(),
//         };
//       }
//       return createThenableQueryChain(null);
//     });

//     const requestBody = {
//       lessons: [
//         {
//           // Missing required fields - this will fail validation
//           title: 'Week 1'
//         },
//         {
//           student_id: '550e8400-e29b-41d4-a716-446655440002',
//           teacher_id: '550e8400-e29b-41d4-a716-446655440003',
//           title: 'Week 2',
//           date: '2024-01-22T10:00:00Z'
//         }
//       ]
//     };

//     const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
//       method: 'POST',
//       body: JSON.stringify(requestBody),
//     });

//     const response = await POST(request);
//     const data = await response.json();

//     // If at least one lesson is valid, API returns 200
//     expect(response.status).toBe(200);
//     expect(data.total).toBe(2);
//     expect(data.success).toBe(1);
//     expect(data.failed).toBe(1);
//     expect(data.errors).toHaveLength(1);
//     expect(data.errors[0].error).toBe('Validation failed');
//   });

//   it('should return 401 when user is not authenticated', async () => {
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: null },
//       error: null,
//     });

//     const requestBody = {
//       lessons: [
//         {
//           student_id: '550e8400-e29b-41d4-a716-446655440002',
//           teacher_id: '550e8400-e29b-41d4-a716-446655440003',
//           title: 'Week 1',
//           date: '2024-01-15T10:00:00Z'
//         }
//       ]
//     };

//     const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
//       method: 'POST',
//       body: JSON.stringify(requestBody),
//     });

//     const response = await POST(request);
//     const data = await response.json();

//     expect(response.status).toBe(401);
//     expect(data.error).toBe('Unauthorized');
//   });

//   it('should return 403 when user does not have permission', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
//     const mockProfile = { role: 'student' };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

//     const requestBody = {
//       lessons: [
//         {
//           student_id: '550e8400-e29b-41d4-a716-446655440002',
//           teacher_id: '550e8400-e29b-41d4-a716-446655440003',
//           title: 'Week 1',
//           date: '2024-01-15T10:00:00Z'
//         }
//       ]
//     };

//     const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
//       method: 'POST',
//       body: JSON.stringify(requestBody),
//     });

//     const response = await POST(request);
//     const data = await response.json();

//     expect(response.status).toBe(403);
//     expect(data.error).toBe('Forbidden');
//   });
// });
