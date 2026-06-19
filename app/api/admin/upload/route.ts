import { isDummyAdminEmail } from '@/lib/admin'
import { getAuthInstance } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

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

    const extension = ALLOWED_IMAGE_TYPES.get(file.type)
    if (!extension) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are allowed' }, { status: 400 })
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Image must be 5MB or smaller' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    await mkdir(uploadDir, { recursive: true })

    const filename = `${Date.now()}-${randomUUID()}.${extension}`
    const bytes = await file.arrayBuffer()
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

    return NextResponse.json({ url: `/uploads/products/${filename}` })
  } catch (error) {
    console.error('Product image upload failed:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
