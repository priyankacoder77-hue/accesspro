'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@clerk/nextjs'

interface OnboardClientProps {
  inviteToken: string | null
}

export function OnboardClient({ inviteToken }: OnboardClientProps) {
  const { session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    async function run() {
      try {
        const body = inviteToken ? JSON.stringify({ inviteToken }) : JSON.stringify({})
        const res = await fetch('/api/bootstrap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(
            (data as { error?: { message?: string } }).error?.message ??
            'Something went wrong during setup — please try again'
          )
          setIsBootstrapping(false)
          return
        }

        const data = (await res.json()) as { role: 'admin' | 'manager'; org_id: string }

        await session?.reload()

        if (data.role === 'admin') {
          window.location.href = '/dashboard/admin'
        } else {
          window.location.href = '/dashboard/manager'
        }
      } catch {
        setError('Request failed — please refresh and try again')
        setIsBootstrapping(false)
      }
    }

    run().catch(err => console.error('[OnboardClient]', err))
  }, [inviteToken, session])

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
        }}
      >
        <div
          className="glass-card"
          style={{
            maxWidth: '400px',
            width: '100%',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '22px',
            }}
          >
            ⚠️
          </div>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              margin: '0 0 8px',
              color: 'var(--text-primary)',
            }}
          >
            Setup failed
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              margin: '0 0 24px',
              lineHeight: 1.6,
            }}
          >
            {error}
          </p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
            style={{ width: '100%' }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '48px 40px',
          textAlign: 'center',
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
            margin: '0 auto 24px',
            animation: isBootstrapping ? 'spin 0.8s linear infinite' : 'none',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            margin: '0 0 8px',
            color: 'var(--text-primary)',
          }}
        >
          Setting up your account
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          This only takes a moment...
        </p>
      </div>
    </div>
  )
}
