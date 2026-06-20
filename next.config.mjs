/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // better-sqlite3 is a native Node addon — must not be bundled by webpack.
  // Vercel loads it at runtime from the project's node_modules.
  serverExternalPackages: ['better-sqlite3'],
}

export default nextConfig
