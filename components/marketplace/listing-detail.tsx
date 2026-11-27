'use client'

import type { Listing } from '@/lib/marketplace-types'
import { ArrowLeft, ArrowUpRight, MapPin, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export function ListingDetail({ listing, userId }: { listing: Listing; userId?: string | null }) {
  const [shared, setShared] = useState(false)
  const sellerName = listing.seller?.full_name || listing.seller_name || 'MarketHub member'
  const image = listing.images?.[0]
  const formattedDate = new Date(listing.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  async function shareListing() {
    const shareData = { title: listing.title, text: `Found on MarketHub: ${listing.title}`, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(shareData)
      else { await navigator.clipboard.writeText(shareData.url); setShared(true); window.setTimeout(() => setShared(false), 1800) }
    } catch { setShared(false) }
  }

  return (
    <main className="detail-page page-container">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span>{listing.category && <><Link href={`/category/${listing.category.slug}`}>{listing.category.name}</Link><span>/</span></>}<span aria-current="page">{listing.title}</span></nav>
      <div className="detail-grid">
        <div>
          <div className="detail-hero-image">{image ? <Image src={image} alt={listing.title} fill priority sizes="(max-width: 820px) 100vw, 60vw" unoptimized /> : <div className="listing-image-empty">{listing.category?.name.slice(0, 1) ?? 'M'}</div>}{listing.is_demo && <span className="demo-chip">Sample listing</span>}</div>
          {listing.images.length > 1 && <div className="detail-thumbnails" aria-label="More listing photos">{listing.images.slice(1, 5).map((src, index) => <div className="detail-thumb" key={`${src}-${index}`}><Image src={src} alt={`${listing.title}, photo ${index + 2}`} fill sizes="68px" unoptimized /></div>)}</div>}
        </div>
        <section className="detail-info" aria-labelledby="listing-title">
          <span className="detail-category">{listing.category?.name ?? 'Local listing'} · {listing.listing_type}</span>
          <h1 id="listing-title">{listing.title}</h1>
          <p className="detail-location"><MapPin size={15} aria-hidden="true" />{[listing.area, listing.city, listing.state, listing.country].filter(Boolean).join(', ')}</p>
          <p className="detail-price">{inr.format(Number(listing.price))}</p>
          <p className="detail-price-note">{listing.price_type === 'negotiable' ? 'Open to a fair offer' : 'Listed price'} · Posted {formattedDate}</p>
          <div className="detail-actions">
            {listing.is_demo ? <button className="primary-button" type="button" disabled title="Demo listings are not available for contact">Sample — contact unavailable</button> : <Link className="primary-button" href={userId ? `/profile?contact=${listing.user_id ?? ''}` : `/auth/login?next=${encodeURIComponent(`/listing/${listing.slug}`)}`}>Contact seller <ArrowUpRight size={16} /></Link>}
            <button type="button" className="outline-button" onClick={shareListing} aria-label="Share listing"><Share2 size={16} />{shared ? 'Copied' : 'Share'}</button>
          </div>
          <div className="detail-facts"><div className="detail-fact"><small>Condition</small><strong>{listing.condition === 'not_applicable' ? 'Not applicable' : listing.condition === 'new' ? 'New' : 'Preloved'}</strong></div><div className="detail-fact"><small>Listing type</small><strong>{listing.listing_type === 'service' ? 'Service' : 'Product'}</strong></div><div className="detail-fact"><small>Price</small><strong>{listing.price_type === 'negotiable' ? 'Negotiable' : 'Fixed'}</strong></div><div className="detail-fact"><small>Area</small><strong>{listing.area || listing.city}</strong></div></div>
          <div className="detail-description"><h2>About this listing</h2><p>{listing.description}</p></div>
          <div className="seller-card"><span className="seller-avatar" aria-hidden="true">{sellerName.charAt(0).toUpperCase()}</span><p><strong>{sellerName}</strong>MarketHub member · Joined {listing.seller_member_since ? new Date(listing.seller_member_since).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'recently'}</p>{!listing.is_demo && <Link href={userId ? `/profile?contact=${listing.user_id ?? ''}` : '/auth/login'}>View profile <ArrowUpRight size={13} /></Link>}</div>
          {listing.is_demo && <div className="demo-detail-note"><strong>Example listing.</strong> This sample helps you explore MarketHub. Demo seller details and contact actions are intentionally disabled.</div>}
          {!listing.is_demo && <p className="report-link"><Link href="/auth/login">Sign in to save or report this listing</Link></p>}
        </section>
      </div>
      <Link className="back-link" href="/search"><ArrowLeft size={14} /> Back to browsing</Link>
    </main>
  )
}
