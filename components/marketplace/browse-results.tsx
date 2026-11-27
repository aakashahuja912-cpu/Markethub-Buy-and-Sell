import { ListingGrid } from '@/components/marketplace/listing-grid'
import type { BrowseFilters, Category, Listing } from '@/lib/marketplace-types'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import Link from 'next/link'
import { SearchFilters } from '@/components/marketplace/search-filters'

function pageUrl(filters: BrowseFilters, page: number) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) if (value && key !== 'page') params.set(key, value)
  if (page > 1) params.set('page', String(page))
  return `/search${params.size ? `?${params.toString()}` : ''}`
}

export function BrowseResults({ title, description, categories, filters, listings, total, page, totalPages, userId }: {
  title: string
  description?: string
  categories: Category[]
  filters: BrowseFilters
  listings: Listing[]
  total: number
  page: number
  totalPages: number
  userId?: string | null
}) {
  return (
    <main className="browse-page page-container">
      <div className="browse-heading"><div><p className="section-kicker">MARKETHUB · DISCOVER</p><h1>{title}</h1><p>{description ?? 'Find something useful, loved and close to home.'}</p></div><span className="results-count">{total} {total === 1 ? 'listing' : 'listings'}</span></div>
      <SearchFilters categories={categories} filters={filters} />
      <div className="browse-demo-notice"><span className="demo-notice-mark">i</span><span>Sample listings are marked <strong>Sample</strong>. Search results also include live listings when available.</span></div>
      {listings.length ? <ListingGrid listings={listings} userId={userId} /> : <div className="empty-state browse-empty"><div className="empty-mark"><Search size={22} /></div><h2>No matches just yet</h2><p>Try a broader location or remove a filter to see more listings.</p><Link className="primary-button" href="/search">Clear all filters <ArrowRight size={16} /></Link></div>}
      {totalPages > 1 && <nav className="pagination" aria-label="Search result pages"><Link aria-disabled={page <= 1} className={page <= 1 ? 'pagination-link is-disabled' : 'pagination-link'} href={page <= 1 ? '#' : pageUrl(filters, page - 1)}><ArrowLeft size={15} /> Previous</Link><span>Page {page} of {totalPages}</span><Link aria-disabled={page >= totalPages} className={page >= totalPages ? 'pagination-link is-disabled' : 'pagination-link'} href={page >= totalPages ? '#' : pageUrl(filters, page + 1)}>Next <ArrowRight size={15} /></Link></nav>}
    </main>
  )
}
