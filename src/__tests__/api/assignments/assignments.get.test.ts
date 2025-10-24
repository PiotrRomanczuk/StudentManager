// import '@testing-library/jest-dom';
// import { GET } from '@/app/api/(main)/assignments/route';
// import { expect } from '@jest/globals';
// import { NextRequest } from 'next/server';

// // Mock Supabase client
// const mockSupabase = {
//   from: jest.fn(),
//   auth: {
//     getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-id' } }, error: null }),
//   },
// };

// jest.mock('@/utils/supabase/clients/server', () => ({
//   createClient: jest.fn(() => mockSupabase),
// }));

// // Helper function to create chained mocks
// const createChainedMock = (returnValue: any) => {
//   const chain = {} as any;
//   chain.select = jest.fn(() => chain);
//   chain.order = jest.fn(() => chain);
//   chain.or = jest.fn(() => chain);
//   chain.eq = jest.fn(() => chain);
//   chain.single = jest.fn(() => Promise.resolve(returnValue));
//   chain.insert = jest.fn(() => chain);
//   chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue)); // for await
//   return chain;
// };

// // Mock NextRequest
// const createMockRequest = (url: string, body?: any): NextRequest => {
//   const mockRequest = {
//     url,
//     json: jest.fn().mockResolvedValue(body || {}),
//   } as unknown as NextRequest;

//   return mockRequest;
// };

// describe('/api/assignments - GET', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockSupabase.from.mockReset();
//   });

//   describe('GET', () => {
//     it('should return tasks when authenticated', async () => {
//       const mockData = {
//         data: [
//           { id: 1, title: 'Task 1', description: 'Description 1' },
//           { id: 2, title: 'Task 2', description: 'Description 2' }
//         ],
//         error: null
//       };
//       mockSupabase.from.mockReturnValue(createChainedMock(mockData));

//       const request = createMockRequest('http://localhost:3000/api/assignments');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.tasks).toBeDefined();
//       expect(Array.isArray(data.tasks)).toBe(true);
//     });

//     it('should handle database errors gracefully', async () => {
//       const mockData = {
//         data: null,
//         error: { message: 'Database connection failed' }
//       };
//       mockSupabase.from.mockReturnValue(createChainedMock(mockData));

//       const request = createMockRequest('http://localhost:3000/api/assignments');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data.error).toBeDefined();
//       expect(data.error).toBe('Database connection failed');
//     });

//     it('should filter by userId when provided', async () => {
//       const mockData = {
//         data: [{ id: 1, title: 'Task 1' }],
//         error: null
//       };
//       mockSupabase.from.mockReturnValue(createChainedMock(mockData));

//       const request = createMockRequest('http://localhost:3000/api/assignments?userId=123');
//       const response = await GET(request);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.tasks).toBeDefined();
//     });
//   });
// });
