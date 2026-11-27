import { BrowseResults } from '@/components/marketplace/browse-results'
import { getCategories, getListings } from '@/lib/marketplace'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

const cities: Record<string, string> = { delhi: 'Delhi', mumbai: 'Mumbai', bengaluru: 'Bengaluru', jaipur: 'Jaipur', lucknow: 'Lucknow', varanasi: 'Varanasi' }
type RouteParams = Promise<{ slug: string }>
export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { slug } = await params
  return { title: `Local listings in ${cities[slug] ?? decodeURIComponent(slug)}` }
}

export default async function CityPage({ params }: { params: RouteParams }) {
  const { slug } = await params
  const city = cities[slug] ?? decodeURIComponent(slug).replace(/-/g, ' ')
  const [categories, result, supabase] = await Promise.all([getCategories(), getListings({ city }), createClient().catch(() => null)])
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
  return <BrowseResults title={`Find good things in ${city}`} description={`Explore products and services listed around ${city}.`} categories={categories} filters={{ city }} listings={result.listings} total={result.total} page={result.page} totalPages={result.totalPages} userId={data.user?.id ?? null} />
}
