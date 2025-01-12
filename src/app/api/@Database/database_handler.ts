import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const DB_Path = '../../../../../../app_new.db';
const pathDB = path.resolve(__dirname, DB_Path);

export default async function openDb() {
	return open({
		filename: pathDB,
		driver: sqlite3.Database,
	});
}
