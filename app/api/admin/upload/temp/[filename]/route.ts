import { NextRequest, NextResponse } from 'next/server'
import { mkdir, readFile } from 'fs/promises'
import path from 'path'
function getMimeTypeByExtension(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename
  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 })
  }

  // Must match the temp directory used in POST upload route
  const tmpDir = path.join(process.cwd(), '.tmp', 'uploads', 'products')
  await mkdir(tmpDir, { recursive: true })

  const filePath = path.join(tmpDir, filename)

  try {
    const buf = await readFile(filePath)
    const mime = getMimeTypeByExtension(filename)

    return new NextResponse(buf, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}

