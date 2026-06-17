import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import path from 'path'

const sqliteDb = new Database(path.join(process.cwd(), 'swayam.db'))

// Enable WAL mode for better concurrent performance
sqliteDb.pragma('journal_mode = WAL')
// Enable foreign keys
sqliteDb.pragma('foreign_keys = ON')

export const db = drizzle(sqliteDb, { schema })
export const sqlite = sqliteDb