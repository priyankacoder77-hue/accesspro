'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useAuth, useSession } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

function InviteAcceptContent() {
  const { userId, isLoaded } = useAuth()
  const { session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const hasRun = useRef(false)
  const sessionRef = useRef(session)
  sessionRef.current = session

  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    if (!isLoaded) return
    if (hasRun.current) return

    if (!token) {
      hasRun.current = true
      setError('No invite token found. Please use the link from your invitation email.')
      setIsProcessing(false)
      return
    }

    if (!userId) {
      hasRun.current = true
      router.replace('/sign-up?invite_token=' + encodeURIComponent(token))
      return
    }

    hasRun.current = true

    async function runBootstrap() {
      try {
        const res = await fetch('/api/bootstrap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteToken: token }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          const message =
            (data as { error?: { message?: string } }).error?.message ??
            'Something went wrong — please try again'
          setError(message)
          setIsProcessing(false)
          return
        }

        const data = (await res.json()) as { role: 'admin' | 'manager'; org_id: string }

        await sessionRef.current?.reload()

        if (data.role === 'manager') {
          window.location.href = '/dashboard/manager'
        } else {
          window.location.href = '/dashboard/admin'
        }
      } catch {
        setError('Request failed — please try again')
        setIsProcessing(false)
      }
    }

    runBootstrap().catch(() => {
      setError('Unexpected error — please try again')
      setIsProcessing(false)
    })
  }, [isLoaded, userId, token, router])

  if (!isLoaded || (isProcessing && !error)) {
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
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; }
          }
        `}</style>
        <div
          className="glass-card"
          style={{
            maxWidth: '400px',
            width: '100%',
            padding: '48px 40px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '3px solid var(--border)',
              borderTopColor: 'var(--accent)',
              margin: '0 auto 24px',
              animation: 'spin 0.8s linear infinite',
            }}
          />
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
              background: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
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
            Invite error
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
            onClick={() => { window.location.href = '/sign-in' }}
            style={{
              minHeight: '44px',
              minWidth: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            Go to sign in
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default function InviteAcceptPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @media (prefers-reduced-motion: reduce) {
              * { animation: none !important; }
            }
          `}</style>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid var(--border)',
              borderTopColor: 'var(--accent)',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        </div>
      }
    >
      <InviteAcceptContent />
    </Suspense>
  )
}
