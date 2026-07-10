import { createAdminClient } from '@/lib/supabaseServer'

let cache = null
let cacheTime = 0
const TTL = 60_000 // 60 detik

export async function getSiteSettings() {
  const now = Date.now()
  if (cache && now - cacheTime < TTL) return cache

  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    const settings = {}
    ;(data || []).forEach(({ key, value }) => { settings[key] = value })
    cache = settings
    cacheTime = now
    return settings
  } catch {
    return cache || {}
  }
}
