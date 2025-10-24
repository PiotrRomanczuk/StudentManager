// import { NextRequest } from 'next/server';
// import { DELETE } from '@/app/api/(main)/lessons/bulk/route';
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
//   //
//   // Make it a real thenable
//   const promise = Promise.resolve({ data, error });
//   chain.then = promise.then.bind(promise);
//   chain.catch = promise.catch.bind(promise);
//   chain.finally = promise.finally.bind(promise);
//   return chain;
// }

// describe('DELETE /api/lessons/bulk', () => {
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

//   it('should delete multiple lessons successfully', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
//     const mockProfile = { role: 'teacher' };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     // Mock the from method to return different chains based on the table name
//     mockSupabase.from.mockImplementation((tableName: string) => {
//       if (tableName === 'profiles') {
//         return createThenableQueryChain(mockProfile);
//       } else if (tableName === 'lessons') {
//         // Return a chain that will be used for lesson deletion
//         return createThenableQueryChain(null);
//       }
//       return createThenableQueryChain(null);
//     });

//     const requestBody = {
//       lessonIds: ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004']
//     };

//     const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
//       method: 'DELETE',
//       body: JSON.stringify(requestBody),
//     });

//     const response = await DELETE(request);
//     const data = await response.json();

//     expect(response.status).toBe(200);
//     expect(data.deleted).toHaveLength(2);
//     expect(data.total).toBe(2);
//     expect(data.success).toBe(2);
//     expect(data.failed).toBe(0);
//   });

//   it('should handle missing lesson IDs', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
//     const mockProfile = { role: 'teacher' };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

//     const requestBody = {
//       lessonIds: ['550e8400-e29b-41d4-a716-446655440001', '', '550e8400-e29b-41d4-a716-446655440004']
//     };

//     const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
//       method: 'DELETE',
//       body: JSON.stringify(requestBody),
//     });

//     const response = await DELETE(request);
//     const data = await response.json();

//     expect(response.status).toBe(200);
//     expect(data.total).toBe(3);
//     expect(data.success).toBe(2);
//     expect(data.failed).toBe(1);
//     expect(data.errors[0].error).toBe('Lesson ID is required');
//   });

//   it('should return 400 when lessonIds array is empty', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
//     const mockProfile = { role: 'teacher' };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

//     const requestBody = {
//       lessonIds: []
//     };

//     const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
//       method: 'DELETE',
//       body: JSON.stringify(requestBody),
//     });

//     const response = await DELETE(request);
//     const data = await response.json();

//     expect(response.status).toBe(400);
//     expect(data.error).toBe('Lesson IDs array is required and cannot be empty');
//   });

//   it('should return 400 when lessonIds array exceeds limit', async () => {
//     const mockUser = { id: '550e8400-e29b-41d4-a716-446655440000', email: 'test@example.com' };
//     const mockProfile = { role: 'teacher' };

//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: mockUser },
//       error: null,
//     });

//     mockSupabase.from.mockReturnValue(createThenableQueryChain(mockProfile));

//     const requestBody = {
//       lessonIds: Array(101).fill('550e8400-e29b-41d4-a716-446655440001')
//     };

//     const request = new NextRequest('http://localhost:3000/api/lessons/bulk', {
//       method: 'DELETE',
//       body: JSON.stringify(requestBody),
//     });

//     const response = await DELETE(request);
//     const data = await response.json();

//     expect(response.status).toBe(400);
//     expect(data.error).toBe('Cannot delete more than 100 lessons at once');
//   });
// });
