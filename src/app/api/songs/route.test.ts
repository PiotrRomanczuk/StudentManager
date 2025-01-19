// import {
// 	describe,
// 	it,
// 	expect,
// 	beforeEach,
// 	afterEach,
// 	jest,
// } from '@jest/globals';
// import { GET, POST, PUT, DELETE } from './route';
// import { getDb } from '@/lib/db';

// jest.mock('@/lib/db');

// describe('Songs API', () => {
// 	beforeEach(() => {
// 		jest.clearAllMocks();
// 	});

// 	describe('GET /api/songs', () => {
// 		it('should return all songs', async () => {
// 			const mockDb = {
// 				all: jest.fn().mockResolvedValue([{ id: 1, title: 'Test Song' }]),
// 			};
// 			(getDb as jest.Mock).mockResolvedValue(mockDb);

// 			const req = new Request('http://localhost/api/songs');
// 			const response = await GET(req);
// 			const data = await response.json();

// 			expect(data.success).toBe(true);
// 			expect(data.data).toHaveLength(1);
// 			expect(mockDb.all).toHaveBeenCalled();
// 		});
// 	});
// });
