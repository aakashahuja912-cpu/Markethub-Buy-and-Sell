'use client'

import type { Listing } from '@/lib/marketplace-types'
import { createClient } from '@/lib/supabase/client'
import { Heart, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export function ListingCard({ listing, userId, saved = false }: { listing: Listing; userId?: string | null; saved?: boolean }) {
  const [isSaved, setIsSaved] = useState(saved)
  const [busy, setBusy] = useState(false)
  const image = listing.images?.[0]
  const listingHref = `/listing/${listing.slug}`

  async function toggleSaved() {
    if (!userId) {
      window.location.href = `/auth/login?next=${encodeURIComponent(listingHref)}`
      return
    }
    if (listing.is_demo || busy) return

    setBusy(true)
    const supabase = createClient()
    const result = isSaved
      ? await supabase.from('favorites').delete().eq('user_id', userId).eq('listing_id', listing.id)
      : await supabase.from('favorites').insert({ user_id: userId, listing_id: listing.id })
    if (!result.error) setIsSaved(!isSaved)
    setBusy(false)
  }

  return (
    <article className="listing-card">
      <div className="listing-image-wrap">
        <Link href={listingHref} className="listing-image-link" aria-label={`View ${listing.title}`}>
          {image ? <Image src={image} alt={listing.title} fill sizes="(max-width: 640px) 48vw, (max-width: 1024px) 31vw, 24vw" unoptimized className="listing-image" /> : <div className="listing-image-empty" aria-hidden="true"><span>{listing.category?.name.slice(0, 1) ?? 'M'}</span></div>}
        </Link>
        {listing.is_demo && <span className="demo-chip">Sample</span>}
        {!listing.is_demo && <button type="button" className={`favorite-button${isSaved ? ' is-saved' : ''}`} onClick={() => void toggleSaved()} disabled={busy} aria-label={isSaved ? `Remove ${listing.title} from saved listings` : `Save ${listing.title}`} aria-pressed={isSaved}><Heart size={17} fill={isSaved ? 'currentColor' : 'none'} /></button>}
      </div>
      <div className="listing-card-content">
        <div className="listing-price-row"><p className="listing-price">{inr.format(Number(listing.price))}</p>{listing.price_type === 'negotiable' && <span className="negotiable-label">Negotiable</span>}</div>
        <Link href={listingHref} className="listing-title">{listing.title}</Link>
        <p className="listing-card-meta"><MapPin size={13} aria-hidden="true" />{listing.area ? `${listing.area}, ` : ''}{listing.city}</p>
        <div className="listing-card-footer"><span>{listing.category?.name ?? 'Marketplace'}</span><span>{new Date(listing.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div>
      </div>
    </article>
  )
}
