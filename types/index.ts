export interface OrgRow {
  id: string
  name: string
  created_at: string
  subscription_status: 'free' | 'active' | 'canceled' | 'past_due'
  plan: 'free' | 'pro'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
}

export interface UserRow {
  id: string
  org_id: string
  role: 'admin' | 'manager'
  email: string
  name: string | null
  created_at: string
}

export interface InviteRow {
  id: string
  org_id: string
  invited_by: string
  email: string
  token: string
  status: 'pending' | 'accepted' | 'expired'
  expires_at: string
  created_at: string
}

export interface SubscriptionRow {
  subscription_status: 'free' | 'active' | 'canceled' | 'past_due'
  plan: 'free' | 'pro'
  current_period_end: string | null
  cancel_at_period_end: boolean
}

export interface SessionClaims {
  publicMetadata: {
    role?: 'admin' | 'manager'
    org_id?: string
  }
}

export interface BootstrapPayload {
  inviteToken?: string
}

export interface InviteCreatePayload {
  email: string
}

export interface PaywallCheckResult {
  allowed: boolean
  code?: 'PAYWALL'
  message?: string
}
