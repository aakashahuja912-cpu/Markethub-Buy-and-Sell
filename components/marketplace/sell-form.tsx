'use client'

import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/marketplace-types'
import { ArrowRight, Check, ImagePlus, LoaderCircle, MapPin, Package, ShieldCheck, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const maxFileBytes = 5 * 1024 * 1024
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function SellForm({ categories }: { categories: Category[] }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [photos, setPhotos] = useState(0)
  const [listingType, setListingType] = useState<'product' | 'service'>('product')
  const router = useRouter()

  function validatePhotos(files: File[]) {
    if (!files.length) return 'Add at least one photo to help buyers see what you’re offering.'
    if (files.length > 5) return 'Choose up to five photos.'
    if (files.some((file) => !allowedTypes.has(file.type))) return 'Use JPG, PNG or WebP photos.'
    if (files.some((file) => file.size > maxFileBytes)) return 'Each photo must be 5 MB or smaller.'
    return ''
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    const form = new FormData(event.currentTarget)
    const files = form.getAll('photos').filter((value): value is File => value instanceof File && value.size > 0)
    const photoError = validatePhotos(files)
    if (photoError) { setError(photoError); setBusy(false); return }

    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData.user) {
      setBusy(false)
      router.push(`/auth/login?next=${encodeURIComponent('/sell')}`)
      return
    }

    const title = String(form.get('title') ?? '').trim()
    const categorySlug = String(form.get('category') ?? '')
    const category = categories.find((item) => item.slug === categorySlug)
    if (!category || category.id.startsWith('sample-')) {
      setError('The marketplace category tables are not ready yet. Demo browsing is available, but posting requires the approved database setup.')
      setBusy(false)
      return
    }

    const uploadedPaths: string[] = []
    try {
      const imageUrls: string[] = []
      for (const [index, file] of files.entries()) {
        const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1]
        const path = `${authData.user.id}/${crypto.randomUUID()}-${index}.${extension}`
        const { error: uploadError } = await supabase.storage.from('listing-images').upload(path, file, { contentType: file.type, upsert: false })
        if (uploadError) throw uploadError
        uploadedPaths.push(path)
        imageUrls.push(supabase.storage.from('listing-images').getPublicUrl(path).data.publicUrl)
      }

      const slugBase = title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 62) || 'local-listing'
      const price = Number(form.get('price'))
      const listing = {
        user_id: authData.user.id,
        category_id: category.id,
        slug: `${slugBase}-${crypto.randomUUID().slice(0, 8)}`,
        title,
        description: String(form.get('description') ?? '').trim(),
        price,
        price_type: String(form.get('priceType') ?? 'fixed'),
        condition: listingType === 'service' ? 'not_applicable' : String(form.get('condition') ?? 'used'),
        listing_type: listingType,
        country: String(form.get('country') ?? '').trim(),
        state: String(form.get('state') ?? '').trim(),
        city: String(form.get('city') ?? '').trim(),
        area: String(form.get('area') ?? '').trim() || null,
        images: imageUrls,
        status: 'active',
        expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      }
      if (!Number.isFinite(price) || price < 0) throw new Error('Enter a valid price.')

      const { data, error: insertError } = await supabase.from('listings').insert(listing).select('slug').single()
      if (insertError) throw insertError
      router.push(`/listing/${data.slug}`)
      router.refresh()
    } catch (cause) {
      if (uploadedPaths.length) await supabase.storage.from('listing-images').remove(uploadedPaths)
      setError(cause instanceof Error ? cause.message : 'Your listing could not be published. Please try again.')
      setBusy(false)
    }
  }

  return (
    <form className="sell-form" onSubmit={submit}>
      <h2 className="form-section-title"><Package size={18} /> What are you listing?</h2>
      <div className="sell-type-toggle" role="radiogroup" aria-label="Choose listing type"><label><input type="radio" name="listing-type" checked={listingType === 'product'} onChange={() => setListingType('product')} /><span>Product for sale</span></label><label><input type="radio" name="listing-type" checked={listingType === 'service'} onChange={() => setListingType('service')} /><span>Service</span></label></div>
      <div className="form-grid">
        <label className="form-field full">Listing title<input name="title" required minLength={4} maxLength={90} placeholder="e.g. Solid wood coffee table" /></label>
        <label className="form-field">Category<select name="category" required defaultValue=""><option value="" disabled>Choose a category</option>{categories.map((category) => <option value={category.slug} key={category.slug}>{category.name}</option>)}</select></label>
        <label className="form-field">Price (INR)<input name="price" type="number" required min="0" max="99999999" step="1" placeholder="0" /></label>
        <label className="form-field">Price flexibility<select name="priceType" defaultValue="fixed"><option value="fixed">Fixed price</option><option value="negotiable">Open to offers</option></select></label>
        {listingType === 'product' && <label className="form-field">Condition<select name="condition" defaultValue="used"><option value="new">New</option><option value="used">Preloved</option></select></label>}
      </div>
      <div className="form-divider" />
      <h2 className="form-section-title"><MapPin size={18} /> Where is it?</h2>
      <div className="form-grid">
        <label className="form-field">Country<input name="country" required defaultValue="India" maxLength={80} /></label>
        <label className="form-field">State / province<input name="state" required maxLength={80} placeholder="e.g. Maharashtra" /></label>
        <label className="form-field">City<input name="city" required maxLength={80} placeholder="e.g. Mumbai" /></label>
        <label className="form-field">Area or neighborhood<input name="area" maxLength={100} placeholder="Optional" /></label>
      </div>
      <div className="form-divider" />
      <h2 className="form-section-title"><Sparkles size={18} /> Add the details</h2>
      <label className="form-field">Description<textarea name="description" required minLength={20} maxLength={3000} placeholder="Share the details a neighbor would want to know…" /></label>
      <label className="image-dropzone"><ImagePlus size={23} /><strong>Add listing photos</strong><small>Up to five JPG, PNG or WebP images · 5 MB each</small><input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required onChange={(event) => { const files = Array.from(event.target.files ?? []); setPhotos(files.length); setError(validatePhotos(files)) }} /><span>{photos ? `${photos} photo${photos === 1 ? '' : 's'} selected` : 'Choose files from your device'}</span></label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <p className="privacy-note"><ShieldCheck size={15} /> Your contact details stay private. Only share what you’re comfortable sharing.</p>
      <button className="primary-button" type="submit" disabled={busy}>{busy ? <><LoaderCircle size={16} className="spin" /> Publishing…</> : <>Publish listing <ArrowRight size={16} /></>}</button>
      <p className="listing-terms">By publishing, you confirm this listing is accurate and follows our community guidelines.</p>
    </form>
  )
}
