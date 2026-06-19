'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { DUMMY_ADMIN_EMAIL } from '@/lib/admin'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const normalizedEmail = email.trim().toLowerCase()

    try {
      const result = isSignUp
        ? await authClient.signUp.email({ email: normalizedEmail, password, name })
        : await authClient.signIn.email({ email: normalizedEmail, password })

      const { error } = result

      if (error) {
        const details =
          // better-auth errors often include more than just message
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.code ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.cause ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as any)?.status

        const action = isSignUp ? 'create account' : 'sign in'
        setError(
          details
            ? `Unable to ${action}: ${error.message ?? 'Please check your details'} (${String(details)})`
            : `Unable to ${action}: ${error.message ?? 'Please check your details'}`
        )
        return
      }

      router.push(normalizedEmail === DUMMY_ADMIN_EMAIL ? '/admin' : '/')
      router.refresh()
    } catch {
      setError('Unable to connect to authentication. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[linear-gradient(135deg,#F8FAFC,#EEF2FF)] px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <Card className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {isSignUp
              ? 'Create your Swayam Agency shopping account.'
              : 'Sign in to continue your order.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? 'Please wait...'
              : isSignUp
                ? 'Create account'
                : 'Sign in'}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Link
            href={isSignUp ? '/sign-in' : '/sign-up'}
            className="font-bold text-primary underline-offset-4 hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </Card>
      </motion.div>
    </main>
  )
}
