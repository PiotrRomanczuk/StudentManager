// import '@testing-library/jest-dom';
// import { GET } from '@/app/api/(main)/lessons/stats/route';
// import { expect } from '@jest/globals';
// import { NextRequest } from 'next/server';

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
//   chain.order = jest.fn(() => chain);
//   chain.or = jest.fn(() => chain);
//   chain.eq = jest.fn(() => chain);
//   chain.gte = jest.fn(() => chain);
//   chain.lte = jest.fn(() => chain);
//   chain.single = jest.fn(() => Promise.resolve(returnValue));
//   chain.insert = jest.fn(() => chain);
//   chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(returnValue)); // for await
//   return chain;
// };

// // Create a more sophisticated mock that can handle different query scenarios
// const createAdvancedMock = (scenarios: { [key: string]: any }) => {
//   const chain = {} as any;
//   let currentScenario = 'default';

//   chain.select = jest.fn(() => chain);
//   chain.order = jest.fn(() => chain);
//   chain.or = jest.fn(() => chain);
//   chain.eq = jest.fn((field: string, value: any) => {
//     if (field === 'status') {
//       if (value === 'SCHEDULED') currentScenario = 'upcoming';
//       else if (value === 'COMPLETED') currentScenario = 'completed';
//       else currentScenario = 'status';
//     }
//     return chain;
//   });
//   chain.gte = jest.fn(() => chain);
//   chain.lte = jest.fn(() => chain);
//   chain.single = jest.fn(() => Promise.resolve(scenarios[currentScenario] || scenarios.default));
//   chain.insert = jest.fn(() => chain);
//   chain.then = (onFulfilled: any) => Promise.resolve(onFulfilled(scenarios[currentScenario] || scenarios.default));

//   return chain;
// };

// function createMockNextRequest(url: string): NextRequest {
//   return {
//     url,
//     nextUrl: new URL(url),
//   } as unknown as NextRequest;
// }

// describe('/api/lessons/stats - Statistics', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockSupabase.from.mockReset();
//   });

//   describe('Authentication', () => {
//     it('should return 401 when user is not authenticated', async () => {
//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: null },
//         error: null,
//       });

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(401);
//       expect(data.error).toBe('Unauthorized');
//     });
//   });

//   describe('Basic Statistics', () => {
//     it('should return basic statistics without filters', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       // Improved mock for supabase.from('lessons')
//       function createLessonsMockBasic() {
//         const lessonsMock: any = {};
//         lessonsMock.select = function (sel: string) {
//           if (sel === '*') {
//             return {
//               ...lessonsMock,
//               then: (onFulfilled: any) => Promise.resolve(onFulfilled({ count: 25, error: null })),
//             };
//           }
//           if (sel === 'student_id') {
//             return {
//               ...lessonsMock,
//               then: (onFulfilled: any) => Promise.resolve(onFulfilled({ data: [
//                 { student_id: 'student1' },
//                 { student_id: 'student2' },
//                 { student_id: 'student3' },
//               ], error: null })),
//             };
//           }
//           return lessonsMock;
//         };
//         lessonsMock.order = jest.fn(() => lessonsMock);
//         lessonsMock.or = jest.fn(() => lessonsMock);
//         lessonsMock.eq = jest.fn(() => lessonsMock);
//         lessonsMock.gte = jest.fn(() => lessonsMock);
//         lessonsMock.lte = jest.fn(() => lessonsMock);
//         lessonsMock.single = jest.fn(() => Promise.resolve({ count: 25, error: null }));
//         lessonsMock.insert = jest.fn(() => lessonsMock);
//         lessonsMock.then = (onFulfilled: any) => Promise.resolve(onFulfilled({ count: 25, error: null }));
//         return lessonsMock;
//       }
//       const lessonsMock = createLessonsMockBasic();

//       const mockLessonSongsQuery = createChainedMock({
//         data: [
//           { lesson_id: '1' },
//           { lesson_id: '2' },
//           { lesson_id: '1' }, // duplicate lesson_id
//           { lesson_id: '3' },
//         ],
//         error: null,
//       });

//       mockSupabase.from.mockImplementation((table) => {
//         if (table === 'lessons') {
//           return lessonsMock;
//         }
//         if (table === 'lesson_songs') {
//           return mockLessonSongsQuery;
//         }
//         return createChainedMock({ count: 25, error: null });
//       });

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.total).toBe(25);
//       expect(data.lessonsWithSongs).toBe(3); // Unique lesson_ids: 1, 2, 3
//       expect(data.avgLessonsPerStudent).toBe(8.33); // 25 / 3 students
//       expect(data.upcoming).toBe(25); // Using the same mock for all queries
//       expect(data.completedThisMonth).toBe(25); // Using the same mock for all queries
//       expect(data.dateRange).toEqual({
//         from: null,
//         to: null
//       });
//     });

//     it('should handle database errors gracefully', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(createChainedMock({
//         count: null,
//         error: { message: 'Database connection failed' },
//       }));

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data.error).toBe('Database connection failed');
//     });
//   });

//   describe('Filtering by userId', () => {
//     it('should filter statistics by userId', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 10,
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(mockBaseQuery);

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats?userId=user456');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.total).toBe(10);
//       expect(mockBaseQuery.or).toHaveBeenCalledWith('student_id.eq.user456,teacher_id.eq.user456');
//     });
//   });

//   describe('Date Range Filtering', () => {
//     it('should filter by dateFrom', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 15,
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(mockBaseQuery);

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats?dateFrom=2024-01-01');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.total).toBe(15);
//       expect(mockBaseQuery.gte).toHaveBeenCalledWith('date', '2024-01-01');
//       expect(data.dateRange).toEqual({
//         from: '2024-01-01',
//         to: null
//       });
//     });

//     it('should filter by dateTo', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 20,
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(mockBaseQuery);

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats?dateTo=2024-12-31');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.total).toBe(20);
//       expect(mockBaseQuery.lte).toHaveBeenCalledWith('date', '2024-12-31');
//       expect(data.dateRange).toEqual({
//         from: null,
//         to: '2024-12-31'
//       });
//     });

//     it('should filter by both dateFrom and dateTo', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 12,
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(mockBaseQuery);

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats?dateFrom=2024-01-01&dateTo=2024-12-31');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.total).toBe(12);
//       expect(mockBaseQuery.gte).toHaveBeenCalledWith('date', '2024-01-01');
//       expect(mockBaseQuery.lte).toHaveBeenCalledWith('date', '2024-12-31');
//       expect(data.dateRange).toEqual({
//         from: '2024-01-01',
//         to: '2024-12-31'
//       });
//     });
//   });

//   describe('Status Statistics', () => {
//     it('should return statistics for all lesson statuses', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       // Mock different counts for each status
//       const mockStatusQueries = {
//         SCHEDULED: createChainedMock({ count: 8, error: null }),
//         IN_PROGRESS: createChainedMock({ count: 3, error: null }),
//         COMPLETED: createChainedMock({ count: 12, error: null }),
//         CANCELLED: createChainedMock({ count: 2, error: null }),
//         RESCHEDULED: createChainedMock({ count: 1, error: null }),
//       };

//       const mockBaseQuery = createChainedMock({
//         count: 26,
//         error: null,
//       });

//       mockSupabase.from.mockImplementation((table) => {
//         if (table === 'lessons') {
//           return mockBaseQuery;
//         }
//         return mockBaseQuery;
//       });

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.total).toBe(26);
//       expect(data.byStatus).toBeDefined();
//     });
//   });

//   describe('Monthly Statistics', () => {
//     it('should return monthly statistics for the last 12 months', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 5,
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(mockBaseQuery);

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.monthly).toBeDefined();
//       expect(Array.isArray(data.monthly)).toBe(true);
//       expect(data.monthly.length).toBe(12);

//       // Check that each month has the expected structure
//       data.monthly.forEach((month: any) => {
//         expect(month).toHaveProperty('month');
//         expect(month).toHaveProperty('count');
//         expect(typeof month.month).toBe('string');
//         expect(typeof month.count).toBe('number');
//       });
//     });
//   });

//   describe('Lessons with Songs', () => {
//     it('should count unique lessons with songs', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 10,
//         error: null,
//       });

//       const mockLessonSongsQuery = createChainedMock({
//         data: [
//           { lesson_id: '1' },
//           { lesson_id: '1' }, // duplicate
//           { lesson_id: '2' },
//           { lesson_id: '3' },
//           { lesson_id: '2' }, // duplicate
//         ],
//         error: null,
//       });

//       mockSupabase.from.mockImplementation((table) => {
//         if (table === 'lessons') {
//           return mockBaseQuery;
//         }
//         if (table === 'lesson_songs') {
//           return mockLessonSongsQuery;
//         }
//         return mockBaseQuery;
//       });

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessonsWithSongs).toBe(3); // Unique lesson_ids: 1, 2, 3
//     });

//     it('should handle lesson_songs query error', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 10,
//         error: null,
//       });

//       const mockLessonSongsQuery = createChainedMock({
//         data: null,
//         error: { message: 'Lesson songs query failed' },
//       });

//       mockSupabase.from.mockImplementation((table) => {
//         if (table === 'lessons') {
//           return mockBaseQuery;
//         }
//         if (table === 'lesson_songs') {
//           return mockLessonSongsQuery;
//         }
//         return mockBaseQuery;
//       });

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.lessonsWithSongs).toBe(0); // Should default to 0 on error
//     });
//   });

//   describe('Average Lessons Per Student', () => {
//     it('should calculate average lessons per student when no userId is specified', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       // Improved mock for supabase.from('lessons')
//       function createLessonsMockAvg() {
//         const lessonsMock: any = {};
//         lessonsMock.select = function (sel: string) {
//           if (sel === '*') {
//             return {
//               ...lessonsMock,
//               then: (onFulfilled: any) => Promise.resolve(onFulfilled({ count: 30, error: null })),
//             };
//           }
//           if (sel === 'student_id') {
//             return {
//               ...lessonsMock,
//               then: (onFulfilled: any) => Promise.resolve(onFulfilled({ data: [
//                 { student_id: 'student1' },
//                 { student_id: 'student2' },
//                 { student_id: 'student3' },
//                 { student_id: 'student4' },
//                 { student_id: 'student5' },
//               ], error: null })),
//             };
//           }
//           return lessonsMock;
//         };
//         lessonsMock.order = jest.fn(() => lessonsMock);
//         lessonsMock.or = jest.fn(() => lessonsMock);
//         lessonsMock.eq = jest.fn(() => lessonsMock);
//         lessonsMock.gte = jest.fn(() => lessonsMock);
//         lessonsMock.lte = jest.fn(() => lessonsMock);
//         lessonsMock.single = jest.fn(() => Promise.resolve({ count: 30, error: null }));
//         lessonsMock.insert = jest.fn(() => lessonsMock);
//         lessonsMock.then = (onFulfilled: any) => Promise.resolve(onFulfilled({ count: 30, error: null }));
//         return lessonsMock;
//       }
//       const lessonsMock = createLessonsMockAvg();

//       const mockLessonSongsQuery = createChainedMock({
//         data: [],
//         error: null,
//       });

//       mockSupabase.from.mockImplementation((table) => {
//         if (table === 'lessons') {
//           return lessonsMock;
//         }
//         if (table === 'lesson_songs') {
//           return mockLessonSongsQuery;
//         }
//         return createChainedMock({ count: 30, error: null });
//       });

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.avgLessonsPerStudent).toBe(6); // 30 / 5 students = 6
//     });

//     it('should return 0 when no students exist', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 0,
//         error: null,
//       });

//       const mockStudentQuery = createChainedMock({
//         data: [],
//         error: null,
//       });

//       mockSupabase.from.mockImplementation((table) => {
//         if (table === 'lessons') {
//           return mockBaseQuery;
//         }
//         return mockBaseQuery;
//       });

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.avgLessonsPerStudent).toBe(0);
//     });

//     it('should not calculate average when userId is specified', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 10,
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(mockBaseQuery);

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats?userId=user456');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.avgLessonsPerStudent).toBe(0); // Should be 0 when userId is specified
//     });
//   });

//   describe('Upcoming and Completed Lessons', () => {
//     it('should count upcoming lessons correctly', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 7,
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(mockBaseQuery);

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.upcoming).toBe(7);
//     });

//     it('should count completed lessons this month correctly', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 15,
//         error: null,
//       });

//       mockSupabase.from.mockReturnValue(mockBaseQuery);

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.completedThisMonth).toBe(15);
//     });
//   });

//   describe('Error Handling', () => {
//     it('should handle unexpected errors', async () => {
//       mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data.error).toBe('Internal server error');
//     });

//     it('should handle student statistics error', async () => {
//       const mockUser = { id: 'user123', email: 'test@example.com' };

//       mockSupabase.auth.getUser.mockResolvedValue({
//         data: { user: mockUser },
//         error: null,
//       });

//       const mockBaseQuery = createChainedMock({
//         count: 10,
//         error: null,
//       });

//       const mockStudentQuery = createChainedMock({
//         data: null,
//         error: { message: 'Student query failed' },
//       });

//       mockSupabase.from.mockImplementation((table) => {
//         if (table === 'lessons') {
//           return mockBaseQuery;
//         }
//         return mockBaseQuery;
//       });

//       const mockRequest = createMockNextRequest('http://localhost:3000/api/lessons/stats');
//       const response = await GET(mockRequest);
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.avgLessonsPerStudent).toBe(0); // Should default to 0 on error
//     });
//   });
// });
