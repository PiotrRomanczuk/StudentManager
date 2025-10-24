// import { NextRequest } from 'next/server';
// import { GET } from '@/app/api/auth/admin/active-users/route';

// // Mock the getActiveUsers function
// jest.mock('@/utils/auth-helpers', () => ({
//   getActiveUsers: jest.fn(),
// }));

// describe('GET /api/auth/admin/active-users', () => {
//   const mockGetActiveUsers = require('@/utils/auth-helpers').getActiveUsers;

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return active users when admin is authenticated', async () => {
//     const mockActiveUsers = [
//       { id: 1, user_id: 'user1', email: 'user1@example.com', isActive: true },
//       { id: 2, user_id: 'user2', email: 'user2@example.com', isActive: true },
//     ];

//     mockGetActiveUsers.mockResolvedValue(mockActiveUsers);

//     const request = new NextRequest('http://localhost:3000/api/auth/admin/active-users');
//     const response = await GET(request);
//     const data = await response.json();

//     expect(response.status).toBe(200);
//     expect(data.success).toBe(true);
//     expect(data.data).toEqual(mockActiveUsers);
//     expect(data.count).toBe(2);
//     expect(mockGetActiveUsers).toHaveBeenCalled();
//   });

//   it('should return 401 when user is not authenticated', async () => {
//     mockGetActiveUsers.mockRejectedValue(new Error('Authentication required'));

//     const request = new NextRequest('http://localhost:3000/api/auth/admin/active-users');
//     const response = await GET(request);
//     const data = await response.json();

//     expect(response.status).toBe(401);
//     expect(data.success).toBe(false);
//     expect(data.error).toBe('Authentication required');
//   });

//   it('should return 403 when user is not admin', async () => {
//     mockGetActiveUsers.mockRejectedValue(new Error('Admin access required'));

//     const request = new NextRequest('http://localhost:3000/api/auth/admin/active-users');
//     const response = await GET(request);
//     const data = await response.json();

//     expect(response.status).toBe(403);
//     expect(data.success).toBe(false);
//     expect(data.error).toBe('Admin access required');
//   });

//   it('should return 500 when database error occurs', async () => {
//     mockGetActiveUsers.mockRejectedValue(new Error('Database error'));

//     const request = new NextRequest('http://localhost:3000/api/auth/admin/active-users');
//     const response = await GET(request);
//     const data = await response.json();

//     expect(response.status).toBe(500);
//     expect(data.success).toBe(false);
//     expect(data.error).toBe('Internal server error');
//   });
// });
