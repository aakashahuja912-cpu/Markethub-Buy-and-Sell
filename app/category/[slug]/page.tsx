import { BrowseResults } from '@/components/marketplace/browse-results'
import { getCategories, getListings } from '@/lib/marketplace'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type RouteParams = Promise<{ slug: string }>
export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find((item) => item.slug === slug)
  return { title: category ? category.name : 'Category' }
}

export default async function CategoryPage({ params }: { params: RouteParams }) {
  const { slug } = await params
  const [categories, result, supabase] = await Promise.all([getCategories(), getListings({ category: slug }), createClient().catch(() => null)])
  const category = categories.find((item) => item.slug === slug)
  if (!category) notFound()
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
  return <BrowseResults title={category.name} description={category.description || `Find ${category.name.toLowerCase()} listed by people nearby.`} categories={categories} filters={{ category: slug }} listings={result.listings} total={result.total} page={result.page} totalPages={result.totalPages} userId={data.user?.id ?? null} />
}
