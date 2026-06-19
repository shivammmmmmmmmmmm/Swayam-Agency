/**
 * Seed script to create the admin user for Swayam Agency.
 *
 * Run with: npx tsx scripts/seed-admin.ts
 *
 * This script:
 * 1. Checks if an admin user already exists
 * 2. If not, creates the admin user with role='admin'
 * 3. Uses the Better Auth API via the running app
 *
 * IMPORTANT: This should be run while the dev server is running
 * because it requires the Better Auth instance to hash passwords.
 */
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import path from 'path'

const ADMIN_EMAIL = 'swayamadmin@gmail.com'
const ADMIN_PASSWORD = 'Admin@123'
const ADMIN_NAME = 'Swayam Admin'

async function seed() {
  console.log('🚀 Starting admin seed...')

  const dbPath = path.join(process.cwd(), 'swayam.db')
  const sqlite = new Database(dbPath)
  const db = drizzle(sqlite, { schema })

  // Check if admin already exists
  const existing = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, ADMIN_EMAIL))
    .limit(1)

  if (existing.length > 0) {
    console.log('✅ Admin user already exists!')
    // Ensure role is admin
    if (existing[0].role !== 'admin') {
      await db
        .update(schema.user)
        .set({ role: 'admin' })
        .where(eq(schema.user.email, ADMIN_EMAIL))
      console.log('✅ Updated existing user role to admin')
    }
    sqlite.close()
    return
  }

  // Create the auth instance to hash the password
  const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    signUp: { enabled: true },
  })

  try {
    // Use Better Auth to create the user (this handles password hashing)
    const result = await auth.api.signUpEmail({
      body: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME,
      },
    })

    if (result && result.user) {
      // Update the user's role to admin
      await db
        .update(schema.user)
        .set({ role: 'admin' })
        .where(eq(schema.user.id, result.user.id))

      console.log('✅ Admin user created successfully!')
      console.log(`   Email: ${ADMIN_EMAIL}`)
      console.log(`   Password: ${ADMIN_PASSWORD}`)
    } else {
      console.error('❌ Failed to create admin user via auth API')
    }
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  }

  sqlite.close()
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})