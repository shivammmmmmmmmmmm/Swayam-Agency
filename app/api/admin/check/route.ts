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

    const isAdmin = dbUser?.role === 'admin' || isDummyAdminEmail(dbUser?.email)

    return NextResponse.json({ isAdmin })
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}
