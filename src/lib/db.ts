import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';

let dbInstance: Database<sqlite3.Database> | null = null;

export async function getDb() {
	if (dbInstance) return dbInstance;

	dbInstance = await open<sqlite3.Database>({
		filename: path.resolve(process.cwd(), 'app.db'),
		driver: sqlite3.Database,
	});

	return dbInstance;
}

export async function closeDb() {
	if (dbInstance) {
		await dbInstance.close();
		dbInstance = null;
	}
}

process.on('SIGINT', closeDb);
process.on('SIGTERM', closeDb);
