import { drizzle } from 'drizzle-orm/better-sqlite3'
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'
import fs from 'fs'

let _db: BetterSQLite3Database<typeof schema> | null = null
let _sqlite: import('better-sqlite3').Database | null = null

function getDbPath(): string {
  if (process.env.VERCEL) {
    return '/tmp/swayam.db'
  }
  return path.join(process.cwd(), 'swayam.db')
}

/**
 * Lazily initialise the SQLite database connection.
 *
 * This function is called only at runtime (auth endpoints / server actions).
 * It must not execute during build/static generation.
 */
export function getDb(): BetterSQLite3Database<typeof schema> {
  if (_db) return _db

  // dynamic require to avoid bundling native bindings at build time
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const BetterSqlite3 = require('better-sqlite3') as typeof import('better-sqlite3')
  const sqliteDbPath = getDbPath()

  // On Vercel, if the DB doesn't exist in /tmp, copy from project root.
  if (process.env.VERCEL && !fs.existsSync(sqliteDbPath)) {
    const source = path.join(process.cwd(), 'swayam.db')
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, sqliteDbPath)
    }
  }

  const sqliteDb = new BetterSqlite3(sqliteDbPath)

  sqliteDb.pragma('journal_mode = WAL')
  sqliteDb.pragma('foreign_keys = ON')

  const userColumns = sqliteDb.prepare('pragma table_info(user)').all() as Array<{ name: string }>
  if (!userColumns.some((column) => column.name === 'role')) {
    sqliteDb.prepare("alter table user add column role text not null default 'user'").run()
  }

  _sqlite = sqliteDb
  _db = drizzle(sqliteDb, { schema })

  return _db
}

export function getSqlite(): import('better-sqlite3').Database | null {
  if (!_sqlite) getDb()
  return _sqlite
}

export function closeDb() {
  if (_sqlite) {
    // better-sqlite3 .close() exists
    ;(_sqlite as any).close()
    _sqlite = null
    _db = null
  }
}
