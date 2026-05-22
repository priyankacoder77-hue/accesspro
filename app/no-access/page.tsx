import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export default async function NoAccessPage() {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role

  const dashboardHref =
    role === 'admin'
      ? '/dashboard/admin'
      : role === 'manager'
        ? '/dashboard/manager'
        : '/onboard'

  const dashboardLabel =
    role === 'admin'
      ? 'Go to Admin Dashboard'
      : role === 'manager'
        ? 'Go to Manager Dashboard'
        : 'Go to Onboarding'

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        background: 'var(--background)',
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--error-bg)',
            border: '1px solid var(--error-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ShieldAlert size={24} style={{ color: 'var(--error)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            You do not have permission to access this page.
          </h1>

          {role ? (
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Your current role is{' '}
              <span
                className="badge badge-accent"
                style={{ fontSize: '12px', verticalAlign: 'middle' }}
              >
                {role}
              </span>
              . Please navigate to your correct dashboard below.
            </p>
          ) : (
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              You do not have an assigned role yet. Please complete onboarding to continue.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '8px' }}>
          <Link href={dashboardHref} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {dashboardLabel}
          </Link>
          <Link href="/" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
