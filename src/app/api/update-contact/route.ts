import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Contact, Update } from '@/lib/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const TAVILY_KEY = process.env.TAVILY_API_KEY

async function tavilySearch(query: string): Promise<string> {
  if (!TAVILY_KEY) return 'No search API key configured.'
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: TAVILY_KEY,
      query,
      search_depth: 'advanced',
      max_results: 5,
      include_answer: true,
    }),
  })
  const data = await res.json()
  const answer = data.answer ? `Summary: ${data.answer}\n\n` : ''
  const results = (data.results ?? [])
    .map((r: { title: string; url: string; content: string }) =>
      `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`
    )
    .join('\n\n')
  return answer + results
}

export async function POST(req: NextRequest) {
  const { contact }: { contact: Contact } = await req.json()

  const searchQuery = `${contact.name} ${contact.tags.join(' ')} 2025 news career update`
  const searchResults = await tavilySearch(searchQuery)

  const existingTitles = contact.updates.map(u => u.title).join('\n- ')

  const prompt = `You are helping maintain a professional relationship tracker called Rolodex.

Contact: ${contact.name}
Tags/context: ${contact.tags.join(', ')}
LinkedIn: ${contact.linkedin ?? 'unknown'}
Website: ${contact.website ?? 'unknown'}
Last updated: ${contact.last_updated}

Existing updates (do NOT duplicate):
- ${existingTitles || 'none'}

Recent web search results:
${searchResults}

Based on the search results, identify NEW professional updates about this person that are not already in the existing updates list. Focus on: career moves, publications, speaking appearances, projects launched, awards, companies founded/acquired.

Return a JSON array of updates. Each update must have:
- title: string (short, specific)
- summary: string (2-3 sentences, factual)
- date: string (YYYY-MM-DD, use today ${new Date().toISOString().split('T')[0]} if unknown)
- notes: string | null (a brief actionable note for the user, or null)

If there are no new updates, return an empty array [].

Respond ONLY with valid JSON, no markdown, no explanation.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '[]'

  let rawUpdates: Omit<Update, 'id' | 'new' | 'notes_date' | 'sent_message' | 'sent_message_date'>[] = []
  try {
    rawUpdates = JSON.parse(text.trim())
    if (!Array.isArray(rawUpdates)) rawUpdates = []
  } catch {
    rawUpdates = []
  }

  const updates: Update[] = rawUpdates.map((u, i) => ({
    ...u,
    id: `u${Date.now()}_${i}`,
    notes_date: u.notes ? new Date().toISOString().split('T')[0] : null,
    sent_message: false,
    sent_message_date: null,
    new: true,
  }))

  return NextResponse.json({ updates })
}
