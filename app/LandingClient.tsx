'use client'

/*
  THEMATIC ANALYSIS
  - Domain: developer/technical (reference app for senior engineers evaluating a stack)
  - Emotional tone: premium + trustworthy — architectural confidence, precision
  - Visual metaphor: an architectural blueprint / IDE schematic — grid lines, terminal frames, role-routing diagrams
  - Typography personality: monospace headlines (JetBrains Mono) + humanist sans (Inter) — code-literate, serious infra brand
*/

import { JetBrains_Mono, Inter } from 'next/font/google'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Menu,
  X,
  ShieldCheck,
  Mail,
  CreditCard,
  Lock,
  ArrowRight,
  Check,
  Terminal,
  GitBranch,
  Users,
  Webhook,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import styles from './landing.module.css'

const headingFont = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})
const bodyFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  return reduced
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>{'<'}</span>
          <span>AccessPro</span>
          <span className={styles.brandMark}>{'/>'}</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="#features" className={styles.navLink}>Features</Link>
          <Link href="#flow" className={styles.navLink}>How it works</Link>
          <Link href="#pricing" className={styles.navLink}>Pricing</Link>
          <Link href="/sign-in" className={styles.navGhost}>Sign in</Link>
          <Link href="/sign-up" className={styles.navPrimary}>Get started</Link>
        </div>
        <button
          aria-label="Toggle menu"
          className={styles.hamburger}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className={styles.mobileMenu}>
          <Link href="#features" onClick={() => setOpen(false)} className={styles.mobileLink}>Features</Link>
          <Link href="#flow" onClick={() => setOpen(false)} className={styles.mobileLink}>How it works</Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className={styles.mobileLink}>Pricing</Link>
          <Link href="/sign-in" onClick={() => setOpen(false)} className={styles.mobileLink}>Sign in</Link>
          <Link href="/sign-up" onClick={() => setOpen(false)} className={styles.navPrimary}>Get started</Link>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  const reduced = useReducedMotion()
  const baseDelay = reduced ? 0 : 0.1

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGrid} aria-hidden />
      <div className={styles.heroGlow} aria-hidden />

      <div className={styles.heroInner}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.heroBadge}
        >
          <span className={styles.heroBadgeDot} />
          <span>Reference architecture · Neev stack</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: baseDelay }}
          className={styles.heroHeadline}
        >
          Multi-Role Access,<br />
          Gated Plans, <span className={styles.gradientText}>Done Right.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: baseDelay * 2 }}
          className={styles.heroSub}
        >
          AccessPro is a production-grade reference app showing exactly how Admin/Manager
          roles, email invites, and Stripe paywall enforcement are built on the Neev stack —
          no shortcuts, no mocks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: baseDelay * 3 }}
          className={styles.heroCtas}
        >
          <Link href="/sign-up" className={styles.ctaPrimary}>
            Get started free <ArrowRight size={16} />
          </Link>
          <Link href="/sign-in" className={styles.ctaGhost}>
            Sign in
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: baseDelay * 4 }}
          className={styles.heroMeta}
        >
          <div className={styles.metaItem}>
            <Lock size={14} /> Server-side paywall
          </div>
          <div className={styles.metaDivider} />
          <div className={styles.metaItem}>
            <ShieldCheck size={14} /> Clerk + Supabase
          </div>
          <div className={styles.metaDivider} />
          <div className={styles.metaItem}>
            <CreditCard size={14} /> Real Stripe checkout
          </div>
        </motion.div>
      </div>

      <div className={styles.terminalFloat} aria-hidden>
        <div className={styles.terminalHeader}>
          <span className={styles.terminalDot} style={{ background: '#ff5f56' }} />
          <span className={styles.terminalDot} style={{ background: '#ffbd2e' }} />
          <span className={styles.terminalDot} style={{ background: '#27c93f' }} />
          <span className={styles.terminalTitle}>middleware.ts</span>
        </div>
        <div className={styles.terminalBody}>
          <div className={styles.codeLine}><span className={styles.codeMuted}>1</span><span className={styles.codeKey}>const</span> role = sessionClaims.publicMetadata.role</div>
          <div className={styles.codeLine}><span className={styles.codeMuted}>2</span><span className={styles.codeKey}>if</span> (path.startsWith(<span className={styles.codeStr}>&apos;/dashboard/admin&apos;</span>) && role !== <span className={styles.codeStr}>&apos;admin&apos;</span>)</div>
          <div className={styles.codeLine}><span className={styles.codeMuted}>3</span>  <span className={styles.codeKey}>return</span> NextResponse.redirect(<span className={styles.codeStr}>&apos;/sign-in&apos;</span>)<span className={styles.cursor} /></div>
        </div>
      </div>
    </section>
  )
}

function SectionWrap({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={styles.section}
    >
      {children}
    </motion.section>
  )
}

function Features() {
  return (
    <SectionWrap id="features">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>// features</div>
        <h2 className={styles.sectionTitle}>Architecture you can trace, line by line.</h2>
        <p className={styles.sectionSub}>
          Every mechanic that matters in a multi-role SaaS — wired correctly, named clearly,
          and enforced where it counts: on the server.
        </p>
      </div>

      <div className={styles.bentoGrid}>
        <div className={`${styles.bentoCard} ${styles.bentoCardFeatured}`}>
          <div className={styles.bentoIcon}>
            <ShieldCheck size={22} />
          </div>
          <h3 className={styles.bentoTitle}>Role separation, enforced at the middleware</h3>
          <p className={styles.bentoText}>
            Admin and Manager roles are written to Clerk <code>publicMetadata</code> at
            bootstrap, read from <code>sessionClaims</code> in middleware, and route users
            to isolated dashboards. Zero database queries on the routing hot path.
          </p>
          <div className={styles.featuredDiagram}>
            <div className={styles.diagramRow}>
              <span className={styles.diagramTag}>Clerk session</span>
              <ArrowRight size={14} />
              <span className={styles.diagramTag}>publicMetadata.role</span>
              <ArrowRight size={14} />
              <span className={styles.diagramTagAccent}>/dashboard/[role]</span>
            </div>
          </div>
        </div>

        <div className={styles.bentoCard}>
          <div className={styles.bentoIcon}><Lock size={22} /></div>
          <h3 className={styles.bentoTitle}>Server-side paywall</h3>
          <p className={styles.bentoText}>
            The seat limit lives in <code>/api/invites/create</code>, not just the UI.
            Direct API calls hit the same 402 as the modal.
          </p>
        </div>

        <div className={styles.bentoCard}>
          <div className={styles.bentoIcon}><Mail size={22} /></div>
          <h3 className={styles.bentoTitle}>Signed invite tokens</h3>
          <p className={styles.bentoText}>
            HMAC-signed tokens with 24h TTL, validated atomically and marked consumed on
            acceptance via Resend-delivered links.
          </p>
        </div>

        <div className={styles.bentoCard}>
          <div className={styles.bentoIcon}><Webhook size={22} /></div>
          <h3 className={styles.bentoTitle}>Stripe webhook + fallback sync</h3>
          <p className={styles.bentoText}>
            Idempotent <code>checkout.session.completed</code> handler, plus a post-checkout
            re-check against the Stripe API so users never see a stale paywall.
          </p>
        </div>
      </div>
    </SectionWrap>
  )
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Admin signs up, org bootstraps',
      body: 'First signup creates an org. /api/bootstrap writes role: "admin" + org_id to Clerk publicMetadata and upserts users + orgs rows in Supabase.',
    },
    {
      n: '02',
      title: 'Invite a Manager by email',
      body: 'Resend delivers a signed token link. The Manager signs up through Clerk on the acceptance page — token validated, role: "manager" written, invite marked consumed.',
    },
    {
      n: '03',
      title: 'Hit the paywall, upgrade, continue',
      body: 'On the second Manager invite, the API returns 402. Stripe Checkout opens. Webhook flips subscription_status to active. Unlimited seats unlocked.',
    },
  ]

  return (
    <SectionWrap id="flow">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>// flow</div>
        <h2 className={styles.sectionTitle}>From signup to subscription, in 60 seconds.</h2>
        <p className={styles.sectionSub}>
          Trace the full lifecycle — auth, invite, payment — in three deliberate steps.
        </p>
      </div>

      <div className={styles.stepsGrid}>
        {steps.map((s) => (
          <div key={s.n} className={styles.step}>
            <div className={styles.stepNumber}>{s.n}</div>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepBody}>{s.body}</p>
          </div>
        ))}
      </div>
    </SectionWrap>
  )
}

function ProductShowcase() {
  const [idx, setIdx] = useState(0)
  const frames = [
    {
      caption: 'Admin dashboard — current plan, manager roster, single invite action.',
      content: 'admin',
    },
    {
      caption: 'Paywall modal — triggered server-side on the second invite attempt.',
      content: 'paywall',
    },
    {
      caption: 'Manager dashboard — minimal, role-isolated, middleware-gated.',
      content: 'manager',
    },
  ]

  const next = () => setIdx((i) => (i + 1) % frames.length)
  const prev = () => setIdx((i) => (i - 1 + frames.length) % frames.length)

  return (
    <SectionWrap>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>// surfaces</div>
        <h2 className={styles.sectionTitle}>What you actually ship.</h2>
        <p className={styles.sectionSub}>
          Three surfaces, three roles, one consistent architecture underneath.
        </p>
      </div>

      <div className={styles.showcaseWrap}>
        <div className={styles.browserFrame}>
          <div className={styles.browserBar}>
            <span className={styles.browserDot} style={{ background: '#ff5f56' }} />
            <span className={styles.browserDot} style={{ background: '#ffbd2e' }} />
            <span className={styles.browserDot} style={{ background: '#27c93f' }} />
            <span className={styles.browserUrl}>accesspro.app{idx === 0 ? '/dashboard/admin' : idx === 1 ? '/dashboard/admin' : '/dashboard/manager'}</span>
          </div>
          <div className={styles.browserBody}>
            {frames[idx].content === 'admin' && (
              <div className={styles.mockAdmin}>
                <div className={styles.mockSidebar}>
                  <div className={styles.mockSidebarItem} data-active>Dashboard</div>
                  <div className={styles.mockSidebarItem}>Managers</div>
                  <div className={styles.mockSidebarItem}>Billing</div>
                </div>
                <div className={styles.mockMain}>
                  <div className={styles.mockPlanCard}>
                    <div className={styles.mockLabel}>Current plan</div>
                    <div className={styles.mockPlanRow}>
                      <span className={styles.mockPlanName}>Free</span>
                      <span className={styles.mockBadge}>1 / 1 manager</span>
                    </div>
                  </div>
                  <div className={styles.mockManagers}>
                    <div className={styles.mockManagerRow}>
                      <span className={styles.mockAvatar} />
                      <span>maria@acme.io</span>
                      <span className={styles.mockStatus}>active</span>
                    </div>
                    <div className={styles.mockManagerRowDisabled}>+ Invite manager</div>
                  </div>
                </div>
              </div>
            )}
            {frames[idx].content === 'paywall' && (
              <div className={styles.mockPaywall}>
                <div className={styles.mockModal}>
                  <div className={styles.mockModalIcon}><Lock size={18} /></div>
                  <div className={styles.mockModalTitle}>Upgrade to invite unlimited managers</div>
                  <div className={styles.mockModalSub}>Free plan includes 1 manager seat.</div>
                  <div className={styles.mockPlanGrid}>
                    <div className={styles.mockPriceBox}>
                      <div className={styles.mockPriceLabel}>Monthly</div>
                      <div className={styles.mockPriceValue}>$10</div>
                    </div>
                    <div className={styles.mockPriceBoxActive}>
                      <div className={styles.mockPriceLabel}>Annual</div>
                      <div className={styles.mockPriceValue}>$100</div>
                    </div>
                  </div>
                  <div className={styles.mockCta}>Continue to Stripe</div>
                </div>
              </div>
            )}
            {frames[idx].content === 'manager' && (
              <div className={styles.mockManager}>
                <div className={styles.mockManagerCard}>
                  <div className={styles.mockLabel}>Signed in as</div>
                  <div className={styles.mockManagerName}>maria@acme.io</div>
                  <div className={styles.mockRoleBadge}>manager</div>
                  <div className={styles.mockLabel} style={{ marginTop: 16 }}>Organization</div>
                  <div className={styles.mockOrgName}>Acme, Inc.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.showcaseControls}>
          <button onClick={prev} aria-label="Previous" className={styles.showcaseArrow}>
            <ChevronLeft size={18} />
          </button>
          <div className={styles.showcaseCaption}>{frames[idx].caption}</div>
          <button onClick={next} aria-label="Next" className={styles.showcaseArrow}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div className={styles.showcaseDots}>
          {frames.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Frame ${i + 1}`}
              className={`${styles.showcaseDot} ${i === idx ? styles.showcaseDotActive : ''}`}
            />
          ))}
        </div>
      </div>
    </SectionWrap>
  )
}

function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <SectionWrap id="pricing">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>// pricing</div>
        <h2 className={styles.sectionTitle}>Honest pricing. Real paywall.</h2>
        <p className={styles.sectionSub}>
          The pricing here isn&apos;t marketing — it&apos;s the artifact under test. A real Stripe
          checkout, gating real seats, on a real schema.
        </p>

        <div className={styles.billingToggle}>
          <button
            onClick={() => setAnnual(false)}
            className={`${styles.toggleBtn} ${!annual ? styles.toggleBtnActive : ''}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`${styles.toggleBtn} ${annual ? styles.toggleBtnActive : ''}`}
          >
            Annual <span className={styles.toggleSave}>save 17%</span>
          </button>
        </div>
      </div>

      <div className={styles.priceGrid}>
        <div className={styles.priceCard}>
          <div className={styles.priceName}>Free</div>
          <div className={styles.priceTagline}>For evaluating the architecture end-to-end.</div>
          <div className={styles.priceValueRow}>
            <span className={styles.priceValue}>$0</span>
            <span className={styles.pricePer}>forever</span>
          </div>
          <ul className={styles.priceList}>
            <li><Check size={16} /> 1 Manager seat</li>
            <li><Check size={16} /> Admin dashboard</li>
            <li><Check size={16} /> Email invite flow</li>
            <li><Check size={16} /> Role-based middleware</li>
          </ul>
          <Link href="/sign-up" className={styles.priceCta}>Start free</Link>
        </div>

        <div className={`${styles.priceCard} ${styles.priceCardFeatured}`}>
          <div className={styles.priceBadge}>Recommended</div>
          <div className={styles.priceName}>Pro</div>
          <div className={styles.priceTagline}>Unlimited managers and a real subscription record.</div>
          <div className={styles.priceValueRow}>
            <span className={styles.priceValue}>${annual ? '100' : '10'}</span>
            <span className={styles.pricePer}>/ {annual ? 'year' : 'month'}</span>
          </div>
          <ul className={styles.priceList}>
            <li><Check size={16} /> Unlimited Manager seats</li>
            <li><Check size={16} /> Admin dashboard</li>
            <li><Check size={16} /> Email invite flow</li>
            <li><Check size={16} /> Subscription management</li>
            <li><Check size={16} /> Stripe webhook + fallback sync</li>
          </ul>
          <Link href="/sign-up" className={styles.priceCtaPrimary}>Get started</Link>
        </div>
      </div>
    </SectionWrap>
  )
}

function FooterCta() {
  return (
    <SectionWrap>
      <div className={styles.footerCta}>
        <div className={styles.footerCtaGrid} aria-hidden />
        <h2 className={styles.footerCtaTitle}>
          Stop guessing how multi-role + billing should be wired.
        </h2>
        <p className={styles.footerCtaSub}>
          Sign up, invite a teammate, hit the paywall, upgrade — and read every line of code
          that made it happen.
        </p>
        <Link href="/sign-up" className={styles.ctaPrimaryLg}>
          Get started free <ArrowRight size={16} />
        </Link>
        <div className={styles.footerCtaNote}>No credit card required to evaluate.</div>
      </div>
    </SectionWrap>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <div className={styles.footerBrand}>AccessPro</div>
          <div className={styles.footerTag}>The multi-role reference app for the Neev stack.</div>
        </div>
        <div className={styles.footerLinks}>
          <Link href="#features" className={styles.footerLink}>Features</Link>
          <Link href="#pricing" className={styles.footerLink}>Pricing</Link>
          <Link href="/sign-in" className={styles.footerLink}>Sign in</Link>
        </div>
      </div>
      <div className={styles.footerCopy}>© {new Date().getFullYear()} AccessPro. All rights reserved.</div>
    </footer>
  )
}

export default function LandingClient() {
  return (
    <div className={`${headingFont.variable} ${bodyFont.variable} ${styles.landingRoot}`}>
      <div className={styles.landingBody}>
        <Nav />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <ProductShowcase />
          <Pricing />
          <FooterCta />
        </main>
        <Footer />
      </div>
    </div>
  )
}
