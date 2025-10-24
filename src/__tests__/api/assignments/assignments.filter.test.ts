// import '@testing-library/jest-dom';
// import { GET } from '@/app/api/(main)/assignments/route';
// import { expect } from '@jest/globals';
// import { NextRequest } from 'next/server';

// const mockSupabase = {
//   from: jest.fn(),
//   auth: {
//     getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-id' } }, error: null }),
//   },
// };

// jest.mock('@/utils/supabase/clients/server', () => ({
//   createClient: jest.fn(() => mockSupabase),
// }));

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

// const createMockRequest = (url: string, body?: any): NextRequest => {
//   const mockRequest = {
//     url,
//     json: jest.fn().mockResolvedValue(body || {}),
//   } as unknown as NextRequest;
//   return mockRequest;
// };

// describe('/api/assignments - Filtering', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockSupabase.from.mockReset();
//   });

//   it('should filter by userId when provided', async () => {
//     const mockData = {
//       data: [{ id: 1, title: 'Task 1' }],
//       error: null
//     };
//     mockSupabase.from.mockReturnValue(createChainedMock(mockData));
//     const request = createMockRequest('http://localhost:3000/api/assignments?userId=123');
//     const response = await GET(request);
//     const data = await response.json();
//     expect(response.status).toBe(200);
//     expect(data.tasks).toBeDefined();
//   });
// });
