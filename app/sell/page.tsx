import { SellForm } from '@/components/marketplace/sell-form'
import { getCategories } from '@/lib/marketplace'
import { Check, Eye, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Post a listing', description: 'List something for sale or offer a local service on MarketHub.' }

export default async function SellPage() {
  const categories = await getCategories()
  return <main className="sell-page page-container"><div className="sell-heading"><p className="section-kicker">GIVE A GOOD THING ANOTHER GO</p><h1>List it. Find its next home.</h1><p>Share a product or service with people nearby. A clear description and a few good photos go a long way.</p></div><div className="sell-layout"><div className="sell-form-card"><SellForm categories={categories} /></div><aside className="seller-tips"><h2>A listing that feels right</h2><ul><li><Check size={15} />Use a clear title and honest details.</li><li><Eye size={15} />Add bright, well-framed photos.</li><li><MessageCircle size={15} />Keep conversations respectful and local.</li></ul></aside></div></main>
}
