import { demoListings } from '@/lib/demo-listings'
import type { BrowseFilters, Category, Listing } from '@/lib/marketplace-types'
import { createClient } from '@/lib/supabase/server'

const starterCategories: Category[] = [
  { id: 'sample-mobiles', name: 'Mobiles & Electronics', slug: 'mobiles-electronics', icon: 'smartphone', description: 'Phones, computers and everyday tech.' },
  { id: 'sample-vehicles', name: 'Vehicles', slug: 'vehicles', icon: 'car-front', description: 'Cars, two-wheelers and more.' },
  { id: 'sample-property', name: 'Property', slug: 'property', icon: 'house', description: 'Homes and spaces near you.' },
  { id: 'sample-furniture', name: 'Furniture', slug: 'furniture', icon: 'armchair', description: 'Give well-loved furniture a new home.' },
  { id: 'sample-fashion', name: 'Fashion', slug: 'fashion', icon: 'shirt', description: 'Clothing, accessories and watches.' },
  { id: 'sample-books', name: 'Books & Education', slug: 'books-education', icon: 'book-open', description: 'Books and learning essentials.' },
  { id: 'sample-sports', name: 'Sports & Fitness', slug: 'sports-fitness', icon: 'dumbbell', description: 'Equipment for an active life.' },
  { id: 'sample-appliances', name: 'Home Appliances', slug: 'home-appliances', icon: 'refrigerator', description: 'Useful things for your home.' },
  { id: 'sample-services', name: 'Services', slug: 'services', icon: 'briefcase-business', description: 'Talented people and local services.' },
  { id: 'sample-pets', name: 'Pets', slug: 'pets', icon: 'paw-print', description: 'Pet care and essentials.' },
  { id: 'sample-other', name: 'Other', slug: 'other', icon: 'package', description: 'A little bit of everything else.' },
]

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, icon, description, sort_order')
      .order('sort_order')

    if (error || !data?.length) return starterCategories
    return data as Category[]
  } catch {
    return starterCategories
  }
}

function matchesDemo(listing: Listing, filters: BrowseFilters) {
  const q = filters.q?.trim().toLocaleLowerCase()
  if (q && !`${listing.title} ${listing.description} ${listing.city} ${listing.state} ${listing.category?.name}`.toLocaleLowerCase().includes(q)) return false
  if (filters.category && listing.category?.slug !== filters.category) return false
  if (filters.country && listing.country.toLowerCase() !== filters.country.toLowerCase()) return false
  if (filters.state && !listing.state.toLowerCase().includes(filters.state.toLowerCase())) return false
  if (filters.city && !listing.city.toLowerCase().includes(filters.city.toLowerCase())) return false
  if (filters.condition && listing.condition !== filters.condition) return false
  if (filters.type && listing.listing_type !== filters.type) return false
  if (filters.priceType && listing.price_type !== filters.priceType) return false
  if (filters.min && listing.price < Number(filters.min)) return false
  if (filters.max && listing.price > Number(filters.max)) return false
  return true
}

function applySort(listings: Listing[], sort: string | undefined) {
  const sorted = [...listings]
  if (sort === 'price-asc') return sorted.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return sorted.sort((a, b) => b.price - a.price)
  if (sort === 'oldest') return sorted.sort((a, b) => a.created_at.localeCompare(b.created_at))
  return sorted.sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getListings(filters: BrowseFilters = {}) {
  let realListings: Listing[] = []

  try {
    const supabase = await createClient()
    let query = supabase
      .from('listings')
      .select('id, user_id, category_id, slug, title, description, price, price_type, condition, listing_type, country, state, city, area, images, status, created_at, expires_at, category:categories(name, slug), seller:profiles(full_name, avatar_url)')
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())

    if (filters.q) {
      const safeQuery = filters.q.trim().replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim()
      if (safeQuery) query = query.or(`title.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%,city.ilike.%${safeQuery}%,area.ilike.%${safeQuery}%`)
    }
    if (filters.category) {
      const { data: category } = await supabase.from('categories').select('id').eq('slug', filters.category).maybeSingle()
      if (category?.id) query = query.eq('category_id', category.id)
    }
    if (filters.subcategory) {
      const { data: subcategory } = await supabase.from('subcategories').select('id').eq('slug', filters.subcategory).maybeSingle()
      if (subcategory?.id) query = query.eq('subcategory_id', subcategory.id)
    }
    if (filters.country) query = query.ilike('country', filters.country)
    if (filters.state) query = query.ilike('state', `%${filters.state}%`)
    if (filters.city) query = query.ilike('city', `%${filters.city}%`)
    if (filters.condition) query = query.eq('condition', filters.condition)
    if (filters.type) query = query.eq('listing_type', filters.type)
    if (filters.priceType) query = query.eq('price_type', filters.priceType)
    if (filters.min && Number.isFinite(Number(filters.min))) query = query.gte('price', Number(filters.min))
    if (filters.max && Number.isFinite(Number(filters.max))) query = query.lte('price', Number(filters.max))

    const orderColumn = filters.sort === 'price-asc' || filters.sort === 'price-desc' ? 'price' : 'created_at'
    const ascending = filters.sort === 'price-asc' || filters.sort === 'oldest'
    const { data, error } = await query.order(orderColumn, { ascending }).limit(100)
    if (!error) realListings = (data ?? []) as unknown as Listing[]
  } catch {
    realListings = []
  }

  const demoResults = demoListings.filter((listing) => matchesDemo(listing, filters))
  const merged = applySort([...realListings, ...demoResults], filters.sort)
  const pageSize = 12
  const page = Math.max(1, Number(filters.page) || 1)
  const total = merged.length
  return {
    listings: merged.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const demo = demoListings.find((listing) => listing.slug === slug)
  if (demo) return demo

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('listings')
      .select('id, user_id, category_id, slug, title, description, price, price_type, condition, listing_type, country, state, city, area, images, status, created_at, expires_at, category:categories(name, slug), seller:profiles(full_name, avatar_url)')
      .eq('slug', slug)
      .maybeSingle()

    if (error || !data) return null
    return data as unknown as Listing
  } catch {
    return null
  }
}
