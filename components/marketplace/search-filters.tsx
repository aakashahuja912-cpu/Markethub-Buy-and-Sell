import type { BrowseFilters, Category } from '@/lib/marketplace-types'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'

export function SearchFilters({ categories, filters }: { categories: Category[]; filters: BrowseFilters }) {
  return (
    <form action="/search" method="get" className="filters-panel" aria-label="Filter marketplace listings">
      <div className="filters-title"><SlidersHorizontal size={16} /><span>Refine your search</span></div>
      <div className="filter-fields">
        <label className="filter-field filter-search"><span>Search</span><input name="q" defaultValue={filters.q} placeholder="What are you looking for?" /></label>
        <label className="filter-field"><span>Category</span><span className="select-wrap"><select name="category" defaultValue={filters.category ?? ''}><option value="">All categories</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select><ChevronDown size={14} aria-hidden="true" /></span></label>
        <label className="filter-field"><span>Country</span><input name="country" defaultValue={filters.country} placeholder="India" /></label>
        <label className="filter-field"><span>State / province</span><input name="state" defaultValue={filters.state} placeholder="e.g. Maharashtra" /></label>
        <label className="filter-field"><span>City</span><input name="city" defaultValue={filters.city} placeholder="e.g. Mumbai" /></label>
        <label className="filter-field"><span>Listing type</span><span className="select-wrap"><select name="type" defaultValue={filters.type ?? ''}><option value="">Any type</option><option value="product">Products</option><option value="service">Services</option></select><ChevronDown size={14} aria-hidden="true" /></span></label>
        <label className="filter-field"><span>Condition</span><span className="select-wrap"><select name="condition" defaultValue={filters.condition ?? ''}><option value="">Any condition</option><option value="new">New</option><option value="used">Preloved</option><option value="not_applicable">Not applicable</option></select><ChevronDown size={14} aria-hidden="true" /></span></label>
        <label className="filter-field"><span>Minimum price</span><input type="number" min="0" name="min" defaultValue={filters.min} placeholder="₹ Min" /></label>
        <label className="filter-field"><span>Maximum price</span><input type="number" min="0" name="max" defaultValue={filters.max} placeholder="₹ Max" /></label>
        <label className="filter-field"><span>Sort by</span><span className="select-wrap"><select name="sort" defaultValue={filters.sort ?? 'latest'}><option value="latest">Newest first</option><option value="oldest">Oldest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select><ChevronDown size={14} aria-hidden="true" /></span></label>
      </div>
      <div className="filter-actions"><a href="/search" className="filter-reset">Reset filters</a><button type="submit" className="primary-button">Show listings <ChevronDown size={15} className="filter-arrow" /></button></div>
    </form>
  )
}
