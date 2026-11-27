'use client'

import { ListingGrid } from '@/components/marketplace/listing-grid'
import type { Category, Listing } from '@/lib/marketplace-types'
import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, BriefcaseBusiness, CarFront, Dumbbell, House, PawPrint, Refrigerator, Search, Shirt, Smartphone, Sofa, Sparkles, Wrench, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

const categoryIcons: Record<string, typeof Smartphone> = {
  smartphone: Smartphone,
  'car-front': CarFront,
  house: House,
  armchair: Sofa,
  shirt: Shirt,
  'book-open': BookOpen,
  dumbbell: Dumbbell,
  refrigerator: Refrigerator,
  'briefcase-business': BriefcaseBusiness,
  wrench: Wrench,
  'paw-print': PawPrint,
  package: Package,
}
const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Jaipur', 'Lucknow', 'Varanasi']

export function HomePage({ categories, listings, userId, favoriteIds }: { categories: Category[]; listings: Listing[]; userId?: string | null; favoriteIds?: string[] }) {
  const reduceMotion = useReducedMotion()
  const featured = listings.slice(0, 8)

  return (
    <main>
      <section className="hero-section page-container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> GOOD THINGS FIND NEW HOMES</div>
          <h1>Find your next<br /><span>good thing.</span></h1>
          <p className="hero-description">A better way to buy, sell and discover what&apos;s close to home. Find something useful, or pass along something great.</p>
          <form className="hero-search" action="/search" role="search">
            <label className="sr-only" htmlFor="hero-query">What are you looking for?</label>
            <Search size={19} aria-hidden="true" />
            <input id="hero-query" name="q" placeholder="What are you looking for?" />
            <button type="submit">Search <ArrowRight size={16} /></button>
          </form>
          <div className="hero-links"><span>Popular:</span>{['Furniture', 'Phones', 'Cars'].map((term) => <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>)}</div>
          <div className="hero-proof"><span className="proof-dot" /><p>Local finds. Real people. A little less waste.</p></div>
        </div>
        <motion.div className="hero-visual" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <Image src="/markethub-hero.png" alt="A thoughtfully furnished, sunlit home with preloved objects ready for a new owner" fill priority sizes="(max-width: 800px) 100vw, 54vw" className="hero-image" />
          <div className="hero-image-note"><span className="note-icon"><Sparkles size={15} /></span><span><strong>Good finds, nearby</strong><small>Made for your neighborhood</small></span><ArrowUpRight size={17} /></div>
          <span className="hero-image-index">01 / 04</span>
        </motion.div>
      </section>

      <section className="category-section page-container" aria-labelledby="category-heading">
        <div className="section-heading"><div><p className="section-kicker">BROWSE THE MARKET</p><h2 id="category-heading">A little bit of everything</h2></div><Link className="text-link" href="/search">Explore all <ArrowRight size={15} /></Link></div>
        <div className="category-grid">{categories.map((category, index) => {
          const Icon = categoryIcons[category.icon] ?? Package
          return <Link href={`/category/${category.slug}`} className="category-tile" key={category.id} style={{ animationDelay: `${index * 35}ms` }}><span className="category-icon"><Icon size={21} strokeWidth={1.7} /></span><span className="category-name">{category.name}</span><ArrowDownRight size={15} className="category-arrow" /></Link>
        })}</div>
      </section>

      <section className="featured-section">
        <div className="page-container">
          <div className="section-heading"><div><p className="section-kicker">FRESH FROM THE NEIGHBORHOOD</p><h2>Recently listed</h2></div><Link className="text-link" href="/search?sort=latest">See all listings <ArrowRight size={15} /></Link></div>
          <div className="demo-notice"><span className="demo-notice-mark">i</span><p>Sample listings are marked <strong>Sample</strong> so you can explore the marketplace before sellers join.</p></div>
          {featured.length ? <ListingGrid listings={featured} userId={userId} favoriteIds={favoriteIds} /> : <div className="empty-state"><div className="empty-mark"><Package size={22} /></div><h3>It&apos;s quiet around here</h3><p>Be the first to list something your neighbors will love.</p><Link className="primary-button" href="/sell">Post the first listing <ArrowRight size={16} /></Link></div>}
        </div>
      </section>

      <section className="city-section page-container"><div className="city-intro"><p className="section-kicker">GOOD THINGS, CLOSE BY</p><h2>Browse your city</h2><p>Start with a place. The right find might be just around the corner.</p></div><div className="city-list">{cities.map((city, index) => <Link key={city} href={`/city/${city.toLowerCase()}`} className="city-link"><span className="city-number">0{index + 1}</span><span>{city}</span><ArrowUpRight size={17} /></Link>)}</div></section>

      <section className="sell-callout page-container"><div className="sell-callout-inner"><div><p className="section-kicker">MAKE ROOM FOR SOMETHING NEW</p><h2>Someone nearby is<br />looking for what you have.</h2><p>Post in a few minutes. Meet someone in your neighborhood. Give a good thing another go.</p><Link href="/sell" className="inverse-button">List an item <ArrowRight size={16} /></Link></div><div className="sell-callout-stamp"><span>GOOD THINGS<br />GO AROUND</span><ArrowDownRight size={24} /></div></div></section>
    </main>
  )
}
