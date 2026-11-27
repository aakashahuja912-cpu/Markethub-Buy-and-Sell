export type Category = {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  sort_order?: number
  subcategories?: Array<{ id: string; name: string; slug: string }>
}

export type Listing = {
  id: string
  slug: string
  title: string
  description: string
  price: number
  price_type: 'fixed' | 'negotiable'
  condition: 'new' | 'used' | 'not_applicable'
  listing_type: 'product' | 'service'
  country: string
  state: string
  city: string
  area?: string | null
  images: string[]
  status?: string
  created_at: string
  expires_at?: string
  user_id?: string
  category_id?: string
  category: { name: string; slug: string } | null
  seller?: { full_name: string | null; avatar_url: string | null } | null
  seller_name?: string
  seller_member_since?: string
  is_demo?: boolean
}

export type BrowseFilters = {
  q?: string
  category?: string
  subcategory?: string
  country?: string
  state?: string
  city?: string
  min?: string
  max?: string
  condition?: string
  type?: string
  priceType?: string
  sort?: string
  page?: string
}
