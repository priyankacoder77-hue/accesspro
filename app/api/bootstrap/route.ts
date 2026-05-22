import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/service'
import crypto from 'crypto'

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'You must be signed in to continue' } },
        { status: 401 }
      )
    }

    const existingRole = (sessionClaims?.publicMetadata as { role?: string })?.role
    const existingOrgId = (sessionClaims?.publicMetadata as { org_id?: string })?.org_id

    if (existingRole && existingOrgId) {
      return NextResponse.json(
        { role: existingRole, org_id: existingOrgId },
        { status: 200 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any

    let body: { inviteToken?: string } = {}
    try {
      body = await req.json()
    } catch {
      body = {}
    }

    const { inviteToken } = body

    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(userId)
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null

    if (inviteToken) {
      // Manager bootstrap path
      const parts = inviteToken.split('.')
      if (parts.length !== 2) {
        return NextResponse.json(
          { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired invite token' } },
          { status: 400 }
        )
      }

      const [raw, signature] = parts
      const inviteSecret = process.env.INVITE_SECRET
      if (!inviteSecret) {
        console.error('[api/bootstrap] INVITE_SECRET env var is not set')
        return NextResponse.json(
          { error: { code: 'SERVER_ERROR', message: 'Server configuration error — please contact support' } },
          { status: 500 }
        )
      }

      const hmac = crypto.createHmac('sha256', inviteSecret)
      hmac.update(raw)
      const expected = hmac.digest('hex')

      let signatureValid = false
      try {
        signatureValid = crypto.timingSafeEqual(
          Buffer.from(signature, 'hex'),
          Buffer.from(expected, 'hex')
        )
      } catch {
        signatureValid = false
      }

      if (!signatureValid) {
        return NextResponse.json(
          { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired invite token' } },
          { status: 400 }
        )
      }

      const { data: invite, error: inviteError } = await db
        .from('invites')
        .select('id, org_id, email, status, expires_at')
        .eq('token', inviteToken)
        .single()

      if (inviteError || !invite) {
        return NextResponse.json(
          { error: { code: 'INVALID_TOKEN', message: 'Invalid or expired invite token' } },
          { status: 400 }
        )
      }

      const inviteRow = invite as {
        id: string
        org_id: string
        email: string
        status: string
        expires_at: string
      }

      if (inviteRow.status !== 'pending') {
        return NextResponse.json(
          { error: { code: 'INVITE_USED', message: 'This invite has already been accepted or expired' } },
          { status: 400 }
        )
      }

      if (new Date(inviteRow.expires_at) < new Date()) {
        await db.from('invites').update({ status: 'expired' }).eq('id', inviteRow.id)
        return NextResponse.json(
          { error: { code: 'INVITE_EXPIRED', message: 'This invite has expired — ask the admin to send a new one' } },
          { status: 400 }
        )
      }

      const orgId = inviteRow.org_id

      const { error: userInsertError } = await db.from('users').upsert(
        {
          id: userId,
          org_id: orgId,
          role: 'manager',
          email,
          name,
        },
        { onConflict: 'id' }
      )

      if (userInsertError) {
        console.error('[api/bootstrap] Failed to upsert manager user', userInsertError)
        return NextResponse.json(
          { error: { code: 'DB_ERROR', message: 'Failed to set up your account — please try again' } },
          { status: 500 }
        )
      }

      const { error: inviteUpdateError } = await db
        .from('invites')
        .update({ status: 'accepted' })
        .eq('id', inviteRow.id)

      if (inviteUpdateError) {
        console.error('[api/bootstrap] Failed to mark invite accepted', inviteUpdateError)
      }

      const { error: clerkError } = await clerk.users.updateUser(userId, {
        publicMetadata: { role: 'manager', org_id: orgId },
      })

      if (clerkError) {
        console.error('[api/bootstrap] Failed to update Clerk metadata', clerkError)
        return NextResponse.json(
          { error: { code: 'CLERK_ERROR', message: 'Failed to set up your account — please try again' } },
          { status: 500 }
        )
      }

      return NextResponse.json({ role: 'manager', org_id: orgId }, { status: 200 })
    } else {
      // Admin bootstrap path
      const orgId = crypto.randomUUID()
      const orgName = email.split('@')[0] ?? 'My Org'

      const { error: orgInsertError } = await db.from('orgs').upsert(
        {
          id: orgId,
          name: orgName,
          subscription_status: 'free',
          plan: 'free',
        },
        { onConflict: 'id' }
      )

      if (orgInsertError) {
        console.error('[api/bootstrap] Failed to upsert org', orgInsertError)
        return NextResponse.json(
          { error: { code: 'DB_ERROR', message: 'Failed to create your organization — please try again' } },
          { status: 500 }
        )
      }

      const { error: userInsertError } = await db.from('users').upsert(
        {
          id: userId,
          org_id: orgId,
          role: 'admin',
          email,
          name,
        },
        { onConflict: 'id' }
      )

      if (userInsertError) {
        console.error('[api/bootstrap] Failed to upsert admin user', userInsertError)
        return NextResponse.json(
          { error: { code: 'DB_ERROR', message: 'Failed to set up your account — please try again' } },
          { status: 500 }
        )
      }

      const { error: clerkError } = await clerk.users.updateUser(userId, {
        publicMetadata: { role: 'admin', org_id: orgId },
      })

      if (clerkError) {
        console.error('[api/bootstrap] Failed to update Clerk metadata', clerkError)
        return NextResponse.json(
          { error: { code: 'CLERK_ERROR', message: 'Failed to set up your account — please try again' } },
          { status: 500 }
        )
      }

      return NextResponse.json({ role: 'admin', org_id: orgId }, { status: 200 })
    }
  } catch (error) {
    console.error('[api/bootstrap]', error)
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Something went wrong — please try again' } },
      { status: 500 }
    )
  }
}
