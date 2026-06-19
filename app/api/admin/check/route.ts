import { getAuthInstance } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { isDummyAdminEmail } from '@/lib/admin'

export async function GET() {
  try {
    const auth = await getAuthInstance()
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
    }

    const db = getDb()
    const [dbUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1)

    // Ensure the known admin email always has role='admin'
    // This fixes Vercel where the seeded DB might not include role.
    if (isDummyAdminEmail(dbUser?.email) && dbUser?.role !== 'admin') {
      await db
        .update(user)
        .set({ role: 'admin' })
        .where(eq(user.id, session.user.id))
    }

    const isAdmin = (dbUser?.role === 'admin') || isDummyAdminEmail(dbUser?.email)
    return NextResponse.json({ isAdmin })
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}

