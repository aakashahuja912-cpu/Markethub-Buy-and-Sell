import { BrowseResults } from '@/components/marketplace/browse-results'
import { getCategories, getListings } from '@/lib/marketplace'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

type RouteParams = Promise<{ slug: string; category: string }>
const cities: Record<string, string> = { delhi: 'Delhi', mumbai: 'Mumbai', bengaluru: 'Bengaluru', jaipur: 'Jaipur', lucknow: 'Lucknow', varanasi: 'Varanasi' }

export default async function CityCategoryPage({ params }: { params: RouteParams }) {
  const { slug, category: categorySlug } = await params
  const city = cities[slug] ?? decodeURIComponent(slug).replace(/-/g, ' ')
  const [categories, result, supabase] = await Promise.all([getCategories(), getListings({ city, category: categorySlug }), createClient().catch(() => null)])
  const category = categories.find((item) => item.slug === categorySlug)
  if (!category) notFound()
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
  return <BrowseResults title={`${category.name} in ${city}`} description={`See ${category.name.toLowerCase()} listed by people around ${city}.`} categories={categories} filters={{ city, category: categorySlug }} listings={result.listings} total={result.total} page={result.page} totalPages={result.totalPages} userId={data.user?.id ?? null} />
}
