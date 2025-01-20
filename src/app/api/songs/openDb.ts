import { open } from 'sqlite';
import sqlite3, { Database } from 'sqlite3';
import path from 'path';

const DB_Path = '../../../../../../app_new.db';
const pathDB = path.resolve(__dirname, DB_Path);

export async function openDb() {
	console.log(pathDB);
	return open({
		filename: pathDB,
		driver: sqlite3.Database,
	});
}

export async function closeDb(db: Database) {
	await db.close();
}
