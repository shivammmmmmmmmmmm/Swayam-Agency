import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'

export default async function SignInPage() {
  const { getAuthInstance } = await import('@/lib/auth')
  const auth = await getAuthInstance()
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')
  return <AuthForm mode="sign-in" />
}