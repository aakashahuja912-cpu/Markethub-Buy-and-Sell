import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { SiteHeader } from '@/components/marketplace/site-header'
import { createClient } from '@/lib/supabase/server'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'MarketHub — Good things find new homes', template: '%s | MarketHub' },
  description: 'Discover, buy and sell quality finds from people in your neighborhood. Find your next good thing on MarketHub.',
  applicationName: 'MarketHub',
  generator: 'Next.js',
  icons: { icon: '/icon.svg' },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090909' },
  ],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let user: { id: string; email?: string; name?: string | null } | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user ? { id: data.user.id, email: data.user.email, name: data.user.user_metadata?.full_name ?? null } : null
  } catch {
    user = null
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-preference" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem('markethub-theme');document.documentElement.dataset.theme=t==='dark'||t==='light'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme='light'}` }} />
      </head>
      <body className="antialiased">
        <SiteHeader user={user} />
        {children}
        <footer className="site-footer"><div className="page-container footer-inner"><div className="footer-brand"><span className="brand-mark" aria-hidden="true">M</span><span className="brand-word">market<span>hub</span><small>DISCOVER · BUY · SELL · CONNECT</small></span></div><p>Good things find new homes.</p><div className="footer-links"><a href="/search">Browse</a><a href="/sell">Sell something</a><a href="/profile">Your profile</a></div><span className="footer-copy">© 2026 MarketHub</span></div></footer>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
