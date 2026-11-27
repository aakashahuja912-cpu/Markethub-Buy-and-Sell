'use client'

import { createClient } from '@/lib/supabase/client'
import type { Listing } from '@/lib/marketplace-types'
import { ArrowRight, LoaderCircle, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export function DashboardListings({ listings, setupNeeded = false, userId }: { listings: Listing[]; setupNeeded?: boolean; userId: string }) {
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function markSold(listing: Listing) {
    setBusyId(listing.id)
    setError('')
    const supabase = createClient()
    const { error: updateError } = await supabase.from('listings').update({ status: 'sold' }).eq('id', listing.id).eq('user_id', userId)
    if (updateError) setError(updateError.message)
    else router.refresh()
    setBusyId('')
  }

  if (setupNeeded) return <div className="empty-state"><div className="empty-mark"><Package size={22} /></div><h2>Database setup needed</h2><p>Your account is ready. Real listings and saved items require the marketplace schema and storage policies.</p><Link className="primary-button" href="/sell">Try posting a listing <ArrowRight size={15} /></Link></div>
  if (!listings.length) return <div className="empty-state"><div className="empty-mark"><Package size={22} /></div><h2>Your marketplace starts here</h2><p>You haven&apos;t published a listing yet.</p><Link className="primary-button" href="/sell">Post your first listing <ArrowRight size={15} /></Link></div>

  return <div className="dashboard-panel">{error && <p role="alert" className="form-error">{error}</p>}<table className="dashboard-table"><thead><tr><th>Listing</th><th>Price</th><th>Status</th><th>Posted</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{listings.map((listing) => <tr key={listing.id}><td><Link className="dashboard-listing-title" href={`/listing/${listing.slug}`}><span className="dashboard-thumb">{listing.images?.[0] && <Image src={listing.images[0]} alt="" fill sizes="44px" unoptimized />}</span><span>{listing.title}</span></Link></td><td>{inr.format(Number(listing.price))}</td><td><span className={`status-pill${listing.status === 'sold' ? ' sold' : ''}`}>{listing.status}</span></td><td>{new Date(listing.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td><td>{listing.status !== 'sold' && <button type="button" className="dashboard-action" disabled={busyId === listing.id} onClick={() => void markSold(listing)}>{busyId === listing.id ? <LoaderCircle size={13} className="spin" /> : 'Mark sold'}</button>}</td></tr>)}</tbody></table></div>
}
