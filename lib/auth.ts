import { betterAuth } from 'better-auth'

const DEMO_ALLOW_SIGNUP =
  process.env.DEMO_ALLOW_SIGNUP === 'true' || process.env.NODE_ENV === 'development'

export async function createAuth() {
  const { drizzleAdapter } = await import('better-auth/adapters/drizzle')
  const { getDb } = await import('@/lib/db')
  const schema = await import('@/lib/db/schema')

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
          : 'http://localhost:3000'),

    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },

    trustedOrigins: [
      'http://localhost:3000',
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
      ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
        : []),
    ],

    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
  })
}

let _instance: Awaited<ReturnType<typeof createAuth>> | null = null
let _promise: Promise<Awaited<ReturnType<typeof createAuth>>> | null = null

export function getAuthInstance(): Promise<Awaited<ReturnType<typeof createAuth>>> {
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
