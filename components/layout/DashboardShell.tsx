'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, Users } from 'lucide-react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/layout/Sidebar'
import type { NavItem } from '@/components/layout/Sidebar'

// ← Code agent updates this map to add app-specific nav items per role.
// Always include a Dashboard/Home item first for each role.
// For single-role apps, only the "default" key is needed.
const navItemsByRole: Record<string, NavItem[]> = {
  default: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Managers', href: '/dashboard/admin/managers', icon: Users },
  ],
  manager: [
    { label: 'Dashboard', href: '/dashboard/manager', icon: LayoutDashboard },
  ],
}

function getNavItems(role: string | null): NavItem[] {
  if (!role) return navItemsByRole.default
  return navItemsByRole[role] ?? navItemsByRole.default
}

interface DashboardShellProps {
  children: React.ReactNode
  role: string | null
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const navItems = getNavItems(role)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('sidebar-collapsed') === 'true') setCollapsed(true)

    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleToggleCollapse = () => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header onMobileMenuOpen={() => setMobileOpen(prev => !prev)} />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          navItems={navItems}
          collapsed={isDesktop && collapsed}
          mobileOpen={mobileOpen}
          onToggleCollapse={handleToggleCollapse}
          onMobileClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 overflow-y-auto min-w-0 px-6 py-10">
          {children}
        </main>
      </div>
    </div>
  )
}
