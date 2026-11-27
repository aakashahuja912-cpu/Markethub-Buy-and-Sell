import type { Listing } from '@/lib/marketplace-types'
import { ListingCard } from '@/components/marketplace/listing-card'

export function ListingGrid({ listings, userId, favoriteIds = [] }: { listings: Listing[]; userId?: string | null; favoriteIds?: string[] }) {
  return <div className="listing-grid">{listings.map((listing, index) => <div className="listing-grid-item" key={listing.id} style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}><ListingCard listing={listing} userId={userId} saved={favoriteIds.includes(listing.id)} /></div>)}</div>
}
