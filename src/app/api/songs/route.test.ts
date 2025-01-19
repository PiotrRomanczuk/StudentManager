// import { NextRequest } from 'next/server';
// import { GET, POST, PUT, DELETE } from './route';
// import { createGuid } from '@/utils/createGuid';
// import { open } from 'sqlite';
// import { Database } from 'sqlite';

// jest.mock('sqlite');
// jest.mock('@/utils/createGuid');

// const mockDb = {
// 	get: jest.fn(),
// 	all: jest.fn(),
// 	run: jest.fn(),
// } as Database;

// beforeEach(() => {
// 	jest.clearAllMocks();
// 	(open as jest.MockedFunction<typeof open>).mockResolvedValue(mockDb);
// 	// (createGuid as jest.MockedFunction<typeof createGuid>).mockReturnValue('mock-guid');
// });

// describe('GET /api/songs', () => {
// 	it('should fetch all songs', async () => {
// 		(mockDb.all as jest.Mock).mockResolvedValue([{ id: '1', title: 'Song 1' }]);
// 		const req = new NextRequest('http://localhost/api/songs');
// 		const res = await GET(req);
// 		expect(res.json()).resolves.toEqual({
// 			success: true,
// 			data: [{ id: '1', title: 'Song 1' }],
// 		});
// 	});

// 	it('should fetch a song by title', async () => {
// 		(mockDb.all as jest.Mock).mockResolvedValue([{ id: '1', title: 'Song 1' }]);
// 		const req = new NextRequest('http://localhost/api/songs?title=Song 1');
// 		const res = await GET(req);
// 		expect(res.json()).resolves.toEqual({
// 			success: true,
// 			data: { id: '1', title: 'Song 1' },
// 		});
// 	});

// 	it('should fetch a song by id', async () => {
// 		(mockDb.all as jest.Mock).mockResolvedValue([{ id: '1', title: 'Song 1' }]);
// 		const req = new NextRequest('http://localhost/api/songs?id=1');
// 		const res = await GET(req);
// 		expect(res.json()).resolves.toEqual({
// 			success: true,
// 			data: { id: '1', title: 'Song 1' },
// 		});
// 	});
// });

// describe('POST /api/songs', () => {
// 	it('should add a new song', async () => {
// 		(mockDb.all as jest.Mock).mockResolvedValue([{ id: '1', title: 'Song 1' }]);
// 		const req = new NextRequest('http://localhost/api/songs', {
// 			method: 'POST',
// 			headers: { 'content-type': 'application/json' },
// 			body: JSON.stringify({
// 				Title: 'New Song',
// 				Author: 'Author',
// 				Level: 'Easy',
// 				SongKey: 'C',
// 				Chords: 'C G Am F',
// 				AudioFiles: 'audio.mp3',
// 				UltimateGuitarLink: 'http://example.com',
// 				ShortTitle: 'New',
// 			}),
// 		});
// 		const res = await POST(req);
// 		expect(res.json()).resolves.toEqual({ success: true, data: { id: '1' } });
// 	});
// });

// describe('PUT /api/songs', () => {
// 	it('should update a song', async () => {
// 		const req = new NextRequest('http://localhost/api/songs?id=1', {
// 			method: 'PUT',
// 			headers: { 'content-type': 'application/json' },
// 			body: JSON.stringify({
// 				Id: '1',
// 				Title: 'Updated Song',
// 				Author: 'Author',
// 				Level: 'Medium',
// 				SongKey: 'G',
// 				Chords: 'G D Em C',
// 				AudioFiles: 'audio.mp3',
// 				CreatedAt: new Date().toISOString(),
// 				UltimateGuitarLink: 'http://example.com',
// 				ShortTitle: 'Updated',
// 			}),
// 		});
// 		const res = await PUT(req);
// 		expect(res.json()).resolves.toEqual({ success: true });
// 	});
// });

// describe('DELETE /api/songs', () => {
// 	it('should delete a song', async () => {
// 		const req = new NextRequest('http://localhost/api/songs?id=1', {
// 			method: 'DELETE',
// 		});
// 		const res = await DELETE(req);
// 		expect(res.json()).resolves.toEqual({ success: true });
// 	});
// });
