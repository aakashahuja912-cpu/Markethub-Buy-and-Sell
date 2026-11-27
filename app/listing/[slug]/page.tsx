import { ListingDetail } from '@/components/marketplace/listing-detail'
import { getListingBySlug } from '@/lib/marketplace'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type RouteParams = Promise<{ slug: string }>
export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { slug } = await params
  const listing = await getListingBySlug(slug)
  return listing ? { title: listing.title, description: listing.description.slice(0, 155) } : { title: 'Listing not found' }
}

export default async function ListingPage({ params }: { params: RouteParams }) {
  const { slug } = await params
  const [listing, supabase] = await Promise.all([getListingBySlug(slug), createClient().catch(() => null)])
  if (!listing) notFound()
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
  return <ListingDetail listing={listing} userId={data.user?.id ?? null} />
}
