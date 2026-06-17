import { getAuthInstance } from '@/lib/auth'
import type { NextRequest } from 'next/server'

/**
 * Better Auth catch-all API route.
 *
 * Keep auth creation lazy so better-sqlite3 native bindings are not loaded
 * during build-time static generation.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> }
) {
  const auth = await getAuthInstance()
  return auth.handler(request)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ all: string[] }> }
) {
  const auth = await getAuthInstance()
  return auth.handler(request)
}

