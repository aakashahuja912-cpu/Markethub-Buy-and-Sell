import { BrowseResults } from '@/components/marketplace/browse-results'
import { getCategories, getListings } from '@/lib/marketplace'
import type { BrowseFilters } from '@/lib/marketplace-types'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Browse listings', description: 'Search local products and services on MarketHub.' }

type Params = Promise<Record<string, string | string[] | undefined>>
function normalize(params: Record<string, string | string[] | undefined>): BrowseFilters {
  const result: BrowseFilters = {}
  for (const key of ['q', 'category', 'subcategory', 'country', 'state', 'city', 'min', 'max', 'condition', 'type', 'sort', 'page'] as const) {
    const value = params[key]
    if (typeof value === 'string') result[key] = value
  }
  const priceType = params.priceType
  if (typeof priceType === 'string') result.priceType = priceType
  return result
}

export default async function SearchPage({ searchParams }: { searchParams: Params }) {
  const params = normalize(await searchParams)
  const [{ listings, total, page, totalPages }, categories, supabase] = await Promise.all([
    getListings(params), getCategories(), createClient().catch(() => null),
  ])
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
  return <BrowseResults title={params.q ? `Results for “${params.q}”` : 'Browse all listings'} description="Explore local finds by country, state, city, category and price." categories={categories} filters={params} listings={listings} total={total} page={page} totalPages={totalPages} userId={data.user?.id ?? null} />
}
