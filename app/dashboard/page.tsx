import { DashboardListings } from '@/components/marketplace/dashboard-listings'
import { createClient } from '@/lib/supabase/server'
import type { Listing } from '@/lib/marketplace-types'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Your listings' }

export default async function DashboardPage() {
  const supabase = await createClient().catch(() => null)
  if (!supabase) return <main className="dashboard-page page-container"><div className="empty-state"><h1>Account services unavailable</h1><p>Connect your Supabase project to manage an account.</p></div></main>
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) redirect('/auth/login?next=/dashboard')
  const { data, error } = await supabase.from('listings').select('id, user_id, category_id, slug, title, description, price, price_type, condition, listing_type, country, state, city, area, images, status, created_at, category:categories(name, slug)').eq('user_id', authData.user.id).order('created_at', { ascending: false })
  const listings = (data ?? []) as unknown as Listing[]
  return <main className="dashboard-page page-container"><div className="dashboard-heading"><div><p className="section-kicker">YOUR MARKETPLACE</p><h1>My listings</h1></div><Link href="/sell" className="primary-button">Post a listing <ArrowRight size={15} /></Link></div><nav className="dashboard-tabs" aria-label="Account navigation"><Link className="active" href="/dashboard">My listings</Link><Link href="/favorites">Saved</Link><Link href="/profile">Profile</Link></nav><DashboardListings listings={listings} userId={authData.user.id} setupNeeded={Boolean(error)} /></main>
}
