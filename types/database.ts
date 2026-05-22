export type Database = {
  public: {
    Tables: {
      orgs: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          created_at?: string
          subscription_status?: 'free' | 'active' | 'canceled' | 'past_due'
          plan?: 'free' | 'pro'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          subscription_status?: 'free' | 'active' | 'canceled' | 'past_due'
          plan?: 'free' | 'pro'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
        }
      }
      users: {
        Row: {
          id: string
          org_id: string
          role: 'admin' | 'manager'
          email: string
          name: string | null
          created_at: string
        }
        Insert: {
          id: string
          org_id: string
          role: 'admin' | 'manager'
          email: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          role?: 'admin' | 'manager'
          email?: string
          name?: string | null
          created_at?: string
        }
      }
      invites: {
        Row: {
          id: string
          org_id: string
          invited_by: string
          email: string
          token: string
          status: 'pending' | 'accepted' | 'expired'
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          invited_by: string
          email: string
          token: string
          status?: 'pending' | 'accepted' | 'expired'
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          invited_by?: string
          email?: string
          token?: string
          status?: 'pending' | 'accepted' | 'expired'
          expires_at?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
