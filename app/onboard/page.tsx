import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { OnboardClient } from '@/components/auth/OnboardClient'

export default async function OnboardPage({
  searchParams,
}: {
  searchParams: Promise<{ invite_token?: string }>
}) {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role

  if (role === 'admin') {
    redirect('/dashboard/admin')
  }

  if (role === 'manager') {
    redirect('/dashboard/manager')
  }

  const params = await searchParams
  const inviteToken = params.invite_token ?? null

  return <OnboardClient inviteToken={inviteToken} />
}
