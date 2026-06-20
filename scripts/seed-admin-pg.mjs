import { hashPassword } from '@better-auth/utils/password'
import pg from 'pg'
import crypto from 'crypto'
import { readFileSync } from 'fs'

// Load .env.local manually
try {
  const env = readFileSync('.env.local', 'utf8')
  for (const line of env.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch {}

const ADMIN_EMAIL = 'swayamadmin@gmail.com'
const ADMIN_PASSWORD = 'Admin@123'
const ADMIN_NAME = 'Swayam Admin'

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL
if (!connectionString) {
  console.error('ERROR: POSTGRES_URL not found in .env.local')
  process.exit(1)
}

const client = new pg.Client({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
})

async function main() {
  await client.connect()
  console.log('Connected to Postgres.')

  const password = await hashPassword(ADMIN_PASSWORD)
  const now = new Date()

  // Check if admin already exists
  const existing = await client.query('SELECT id FROM "user" WHERE email = $1', [ADMIN_EMAIL])

  if (existing.rows.length > 0) {
    const userId = existing.rows[0].id

    // Update user role
    await client.query(
      'UPDATE "user" SET name = $1, role = $2, "updatedAt" = $3 WHERE id = $4',
      [ADMIN_NAME, 'admin', now, userId]
    )

    // Update or insert account
    const account = await client.query(
      'SELECT id FROM account WHERE "userId" = $1 AND "providerId" = $2',
      [userId, 'credential']
    )

    if (account.rows.length > 0) {
      await client.query(
        'UPDATE account SET password = $1, "updatedAt" = $2 WHERE id = $3',
        [password, now, account.rows[0].id]
      )
    } else {
      await client.query(
        'INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [crypto.randomUUID(), userId, 'credential', userId, password, now, now]
      )
    }

    console.log('✓ Admin user updated successfully.')
  } else {
    const userId = crypto.randomUUID()

    await client.query(
      'INSERT INTO "user" (id, name, email, "emailVerified", role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, ADMIN_NAME, ADMIN_EMAIL, false, 'admin', now, now]
    )

    await client.query(
      'INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [crypto.randomUUID(), userId, 'credential', userId, password, now, now]
    )

    console.log('✓ Admin user created successfully.')
  }

  await client.end()
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
