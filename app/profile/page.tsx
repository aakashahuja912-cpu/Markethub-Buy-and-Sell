import { createClient } from '@/lib/supabase/server'
import { ArrowRight, UserRound } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Your profile' }

export default async function ProfilePage() {
  const supabase = await createClient().catch(() => null)
  if (!supabase) return <main className="auth-page page-container"><section className="auth-card"><h1>Account unavailable</h1><p>Connect your Supabase project to access profiles.</p></section></main>
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/auth/login?next=/profile')
  const name = data.user.user_metadata?.full_name ?? 'MarketHub member'
  return <main className="auth-page page-container"><section className="auth-card"><p className="auth-kicker">YOUR ACCOUNT</p><h1>Profile</h1><div className="seller-card"><span className="seller-avatar"><UserRound size={19} /></span><p><strong>{name}</strong>{data.user.email}</p></div><p className="auth-description" style={{ marginTop: 17 }}>Your account is managed securely by Supabase. Your contact details are not shown on public listings.</p><Link className="primary-button" href="/dashboard">Go to your listings <ArrowRight size={15} /></Link></section></main>
}
