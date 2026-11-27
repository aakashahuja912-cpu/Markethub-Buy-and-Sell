import { ListingGrid } from '@/components/marketplace/listing-grid'
import { createClient } from '@/lib/supabase/server'
import type { Listing } from '@/lib/marketplace-types'
import { Heart, Package } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Saved listings' }

export default async function FavoritesPage() {
  const supabase = await createClient().catch(() => null)
  if (!supabase) return <main className="browse-page page-container"><div className="empty-state"><Heart size={22} /><h1>Saved listings</h1><p>Connect your account to save listings.</p></div></main>
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) redirect('/auth/login?next=/favorites')
  const { data, error } = await supabase.from('favorites').select('listing:listings(id, user_id, category_id, slug, title, description, price, price_type, condition, listing_type, country, state, city, area, images, status, created_at, category:categories(name, slug))').eq('user_id', authData.user.id).order('created_at', { ascending: false })
  const favoriteRows = (data ?? []) as unknown as Array<{ listing: Listing | Listing[] | null }>
  const listings = favoriteRows.map((item) => Array.isArray(item.listing) ? item.listing[0] : item.listing).filter((item): item is Listing => Boolean(item))
  return <main className="browse-page page-container"><div className="browse-heading"><div><p className="section-kicker">KEEP THE GOOD ONES CLOSE</p><h1>Saved listings</h1><p>Listings you&apos;ve kept for later.</p></div></div>{error ? <div className="empty-state"><div className="empty-mark"><Package size={22} /></div><h2>Saved listings need database setup</h2><p>Favorites will appear here once marketplace data storage is enabled.</p><Link className="primary-button" href="/search">Browse sample listings</Link></div> : listings.length ? <ListingGrid listings={listings} userId={authData.user.id} favoriteIds={listings.map((item) => item.id)} /> : <div className="empty-state"><div className="empty-mark"><Heart size={22} /></div><h2>No saved finds yet</h2><p>Tap the heart on a listing to keep it here.</p><Link className="primary-button" href="/search">Explore listings</Link></div>}</main>
}
