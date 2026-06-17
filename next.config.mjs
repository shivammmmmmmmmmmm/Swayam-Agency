/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Prevent Vercel from bundling better-sqlite3 during build.
  // The native addon is loaded lazily at runtime via dynamic import
  // inside lib/db/index.ts and lib/auth.ts.
  serverExternalPackages: ['better-sqlite3'],
}

export default nextConfig