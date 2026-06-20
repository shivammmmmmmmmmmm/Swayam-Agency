import { drizzle } from 'drizzle-orm/node-postgres'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

let _db: NodePgDatabase<typeof schema> | null = null
let _pool: Pool | null = null

function getConnectionString(): string {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'POSTGRES_URL environment variable is not set. ' +
      'Add it from your Vercel project Storage tab.'
    )
  }
  return url
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (_db) return _db

  const connectionString = getConnectionString()

  _pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    max: 5,
  })

  _db = drizzle(_pool, { schema })
  return _db
}

export async function closeDb() {
  if (_pool) {
    await _pool.end()
    _pool = null
    _db = null
  }
}
