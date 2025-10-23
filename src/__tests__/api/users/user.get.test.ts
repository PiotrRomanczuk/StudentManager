// /**
//  * @jest-environment node
//  */
// import '@testing-library/jest-dom';
// import { GET } from '@/app/api/(main)/user/route';
// import { expect } from '@jest/globals';

// // Mock fetch globally
// global.fetch = jest.fn();

// // Mock the Supabase client to avoid cookies() error
// jest.mock('@/utils/supabase/clients/server', () => ({
//   createClient: jest.fn(() => ({
//     from: jest.fn(() => ({
//       select: jest.fn(() => ({
//         order: jest.fn(() => ({
//           eq: jest.fn(() => ({
//             single: jest.fn(),
//           })),
//         })),
//       })),
//     })),
//   })),
// }));

// describe('/api/user - GET', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('GET', () => {
//     it('should return user data and isAdmin: true when admin check succeeds', async () => {
//       const mockUser = {
//         id: 'user123',
//         email: 'admin@example.com',
//         user_metadata: { role: 'admin' },
//       };

//       // Mock the fetch call to the user-and-admin endpoint
//       (global.fetch as jest.Mock).mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           user: mockUser,
//           isAdmin: true,
//         }),
//       });

//       const response = await GET(new Request('http://localhost:3000/api/user'));
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.user).toEqual(mockUser);
//       expect(data.isAdmin).toBe(true);
//       expect(global.fetch).toHaveBeenCalledWith(
//         'http://localhost:3000/api/auth/admin/user-and-admin',
//         expect.objectContaining({
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })
//       );
//     });

//     it('should return user data and isAdmin: false when admin check fails', async () => {
//       const mockUser = {
//         id: 'user123',
//         email: 'user@example.com',
//         user_metadata: { role: 'user' },
//       };

//       // Mock the fetch call to the user-and-admin endpoint
//       (global.fetch as jest.Mock).mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           user: mockUser,
//           isAdmin: false,
//         }),
//       });

//       const response = await GET(new Request('http://localhost:3000/api/user'));
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.user).toEqual(mockUser);
//       expect(data.isAdmin).toBe(false);
//       expect(global.fetch).toHaveBeenCalledWith(
//         'http://localhost:3000/api/auth/admin/user-and-admin',
//         expect.objectContaining({
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })
//       );
//     });

//     it('should return 401 when authentication fails', async () => {
//       // Mock the fetch call to return an error
//       (global.fetch as jest.Mock).mockResolvedValueOnce({
//         ok: false,
//         status: 401,
//         json: async () => ({
//           error: 'Authentication error',
//         }),
//       });

//       const response = await GET(new Request('http://localhost:3000/api/user'));
//       const data = await response.json();

//       expect(response.status).toBe(401);
//       expect(data.error).toBe('Authentication error');
//       expect(global.fetch).toHaveBeenCalledWith(
//         'http://localhost:3000/api/auth/admin/user-and-admin',
//         expect.objectContaining({
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })
//       );
//     });

//     it('should return 401 when no user is found', async () => {
//       // Mock the fetch call to return an error
//       (global.fetch as jest.Mock).mockResolvedValueOnce({
//         ok: false,
//         status: 401,
//         json: async () => ({
//           error: 'No authenticated user found',
//         }),
//       });

//       const response = await GET(new Request('http://localhost:3000/api/user'));
//       const data = await response.json();

//       expect(response.status).toBe(401);
//       expect(data.error).toBe('No authenticated user found');
//       expect(global.fetch).toHaveBeenCalledWith(
//         'http://localhost:3000/api/auth/admin/user-and-admin',
//         expect.objectContaining({
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })
//       );
//     });

//     it('should handle unexpected errors gracefully', async () => {
//       // Mock the fetch call to throw an error
//       (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Unexpected error'));

//       const response = await GET(new Request('http://localhost:3000/api/user'));
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data.error).toBe('Internal server error');
//     });

//     it('should handle admin getUserById error and return isAdmin: false', async () => {
//       const mockUser = {
//         id: 'user123',
//         email: 'user@example.com',
//         user_metadata: { role: 'user' },
//       };

//       // Mock the fetch call to return user with isAdmin: false
//       (global.fetch as jest.Mock).mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           user: mockUser,
//           isAdmin: false,
//         }),
//       });

//       const response = await GET(new Request('http://localhost:3000/api/user'));
//       const data = await response.json();

//       expect(response.status).toBe(200);
//       expect(data.user).toEqual(mockUser);
//       expect(data.isAdmin).toBe(false);
//       expect(global.fetch).toHaveBeenCalledWith(
//         'http://localhost:3000/api/auth/admin/user-and-admin',
//         expect.objectContaining({
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })
//       );
//     });

//     it('should handle non-Error exceptions', async () => {
//       // Mock the fetch call to throw a string error
//       (global.fetch as jest.Mock).mockRejectedValueOnce('String error');

//       const response = await GET(new Request('http://localhost:3000/api/user'));
//       const data = await response.json();

//       expect(response.status).toBe(500);
//       expect(data.error).toBe('Internal server error');
//     });
//   });
// });
