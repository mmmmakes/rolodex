import { NextRequest, NextResponse } from 'next/server'

// Vercel cron: runs weekly — see vercel.json
// In production this would pull contacts from Supabase,
// run updates for each, and save results back.
// For now it's a stub that confirms the cron is wired.

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // TODO: Replace with Supabase contact fetch once DB is wired
  // const contacts = await supabase.from('contacts').select('*')
  // for (const contact of contacts) { await updateContact(contact) }

  return NextResponse.json({ ok: true, ran_at: new Date().toISOString() })
}
