import { HomePage } from '@/components/marketplace/home-page'
import { getCategories, getListings } from '@/lib/marketplace'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const [{ listings }, categories, supabase] = await Promise.all([
    getListings({ sort: 'latest', page: '1' }),
    getCategories(),
    createClient().catch(() => null),
  ])
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } }
  return <HomePage categories={categories} listings={listings} userId={data.user?.id ?? null} />
}
