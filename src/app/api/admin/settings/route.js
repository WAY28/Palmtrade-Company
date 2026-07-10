import { NextResponse } from 'next/server'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabaseServer'

async function requireSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// GET — ambil semua settings
export async function GET() {
  if (!(await requireSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
    if (error) throw error
    // Ubah array [{key,value}] jadi object {key: value}
    const settings = {}
    ;(data || []).forEach(({ key, value }) => { settings[key] = value })
    return NextResponse.json(settings)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST — simpan banyak settings sekaligus
export async function POST(request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json() // { key: value, key2: value2, ... }
    const supabase = createAdminClient()

    const upserts = Object.entries(body).map(([key, value]) => ({ key, value }))
    const { error } = await supabase
      .from('site_settings')
      .upsert(upserts, { onConflict: 'key' })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
