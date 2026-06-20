import { NextResponse } from 'next/server'

// This route is no longer used. Images are returned as base64 data URLs
// directly from the upload endpoint and stored in the database.
export async function GET() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
