import { isDummyAdminEmail } from '@/lib/admin'
import { getAuthInstance } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

async function requireAdmin(request: NextRequest) {
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return false

  const db = getDb()
  const [dbUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  return dbUser?.role === 'admin' || isDummyAdminEmail(dbUser?.email)
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await requireAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('image')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are allowed' }, { status: 400 })
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Image must be 5MB or smaller' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({ url: dataUrl })
  } catch (error) {
    console.error('Product image upload failed:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
