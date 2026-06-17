import { betterAuth } from 'better-auth'

const DEMO_ALLOW_SIGNUP =
  process.env.DEMO_ALLOW_SIGNUP === 'true' || process.env.NODE_ENV === 'development'

/**
 * Create a fresh Better Auth instance.
 *
 * Important (Vercel + better-sqlite3):
 * - We dynamically import the drizzle adapter and the sqlite db *inside*
 *   this function so `better-sqlite3` native bindings are never required
 *   during build-time static generation.
 */
export async function createAuth() {
  // Load only at runtime
  const { drizzleAdapter } = await import('better-auth/adapters/drizzle')
  const { getDb } = await import('@/lib/db')
  const schema = await import('@/lib/db/schema')

  // NOTE: BETTER_AUTH_SECRET is required by better-auth.
  // It is expected to be provided via environment variables.
  // (We intentionally do not hardcode secrets.)

  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: 'sqlite',
      schema,
    }),

    baseURL:
      process.env.BETTER_AUTH_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.V0_RUNTIME_URL),

    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },

    // Demo mode: allow anyone to sign up
    ...(DEMO_ALLOW_SIGNUP
      ? { signUp: { enabled: true } }
      : { signUp: { enabled: true } }),

    trustedOrigins: [
      ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
      ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
        : []),
    ],

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },

    ...(process.env.NODE_ENV === 'development'
      ? {
          advanced: {
            defaultCookieAttributes: {
              sameSite: 'none' as const,
              secure: true,
            },
          },
        }
      : {}),
  })
}

// Cache (per serverless instance)
let _instance: Awaited<ReturnType<typeof createAuth>> | null = null
let _promise: Promise<Awaited<ReturnType<typeof createAuth>>> | null = null

/**
 * Lazily get the Better Auth instance.
 *
 * Ensures better-sqlite3 is loaded only when an auth endpoint is hit.
 */
export function getAuthInstance(): Promise<
  Awaited<ReturnType<typeof createAuth>>
> {
  if (_instance) return Promise.resolve(_instance)
  if (!_promise) {
    _promise = createAuth().then((inst) => {
      _instance = inst
      _promise = null
      return inst
    })
  }
  return _promise
}

