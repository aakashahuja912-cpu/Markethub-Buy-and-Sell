'use client'

import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Heart, MapPin, Menu, Plus, Search, UserRound, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/marketplace/theme-toggle'

type SiteUser = { id: string; email?: string; name?: string | null }
const popularCities = ['Delhi', 'Mumbai', 'Bengaluru', 'Jaipur', 'Lucknow', 'Varanasi']

export function SiteHeader({ user }: { user: SiteUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [city, setCity] = useState('')
  const [search, setSearch] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setCity(localStorage.getItem('markethub-city') ?? '')
  }, [])

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('q', search.trim())
    if (city) params.set('city', city)
    router.push(`/search${params.size ? `?${params.toString()}` : ''}`)
    setMenuOpen(false)
  }

  async function signOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    setSigningOut(false)
  }

  function setLocation(value: string) {
    setCity(value)
    if (value) localStorage.setItem('markethub-city', value)
    else localStorage.removeItem('markethub-city')
  }

  return (
    <header className="site-header">
      <div className="header-main page-container">
        <Link href="/" className="brand" aria-label="MarketHub home">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span className="brand-word">market<span>hub</span><small>DISCOVER · BUY · SELL · CONNECT</small></span>
        </Link>
        <form className="header-search" onSubmit={submitSearch} role="search">
          <label className="sr-only" htmlFor="site-search">Search listings</label>
          <Search aria-hidden="true" size={17} />
          <input id="site-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for anything nearby" />
          <span className="search-divider" />
          <label className="sr-only" htmlFor="site-city">Filter by city</label>
          <MapPin aria-hidden="true" size={16} />
          <select id="site-city" value={city} onChange={(event) => setLocation(event.target.value)}>
            <option value="">All India</option>
            {popularCities.map((place) => <option key={place} value={place}>{place}</option>)}
          </select>
          <button type="submit" className="search-submit" aria-label="Search"><ArrowRight size={17} /></button>
        </form>
        <nav className="header-actions" aria-label="Main navigation">
          <ThemeToggle />
          <Link className="header-favorites" href="/favorites" aria-label="Saved listings"><Heart size={18} /><span>Saved</span></Link>
          {user ? (
            <div className="user-actions">
              <Link className="account-link" href="/dashboard"><UserRound size={17} /><span>{user.name?.split(' ')[0] || 'Account'}</span></Link>
              <button type="button" className="sign-out-link" disabled={signingOut} onClick={signOut}>{signingOut ? 'Signing out…' : 'Sign out'}</button>
            </div>
          ) : <Link className="login-link" href="/auth/login">Sign in</Link>}
          <Link className="sell-button" href="/sell"><Plus size={17} strokeWidth={2.5} /><span>Sell</span></Link>
        </nav>
        <button className="icon-button mobile-menu-button" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && <div className="mobile-menu page-container">
        <form className="mobile-search" onSubmit={submitSearch} role="search">
          <label className="sr-only" htmlFor="mobile-search">Search listings</label>
          <input id="mobile-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search listings" />
          <button className="search-submit" type="submit" aria-label="Search"><Search size={17} /></button>
        </form>
        <label className="mobile-location"><MapPin size={16} /><span>Location</span><select value={city} onChange={(event) => setLocation(event.target.value)}><option value="">All India</option>{popularCities.map((place) => <option key={place} value={place}>{place}</option>)}</select></label>
        <Link href="/favorites" onClick={() => setMenuOpen(false)}><Heart size={17} /> Saved listings</Link>
        {user ? <><Link href="/dashboard" onClick={() => setMenuOpen(false)}><UserRound size={17} /> My dashboard</Link><button type="button" className="mobile-signout" onClick={signOut}>Sign out</button></> : <Link href="/auth/login" onClick={() => setMenuOpen(false)}><UserRound size={17} /> Sign in</Link>}
        <div className="mobile-theme"><span>Appearance</span><ThemeToggle /></div>
        <Link className="sell-button mobile-sell" href="/sell" onClick={() => setMenuOpen(false)}><Plus size={17} /> Post an ad</Link>
      </div>}
    </header>
  )
}
