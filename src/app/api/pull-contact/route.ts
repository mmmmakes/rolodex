import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const TAVILY_KEY = process.env.TAVILY_API_KEY

export async function POST(req: NextRequest) {
  const { url }: { url: string } = await req.json()

  let pageContent = ''
  if (TAVILY_KEY) {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_KEY,
        query: url,
        search_depth: 'basic',
        max_results: 3,
        include_answer: false,
      }),
    })
    const data = await res.json()
    pageContent = (data.results ?? [])
      .map((r: { title: string; content: string }) => `${r.title}\n${r.content}`)
      .join('\n\n')
  }

  const prompt = `Extract contact information from this LinkedIn/website URL and the content below.

URL: ${url}
Content: ${pageContent || 'No content available - extract what you can from the URL alone.'}

Return a JSON object with these fields (use null for unknown):
{
  "name": string,
  "phone": string | null,
  "email": string | null,
  "linkedin": string | null,
  "website": string | null,
  "instagram": string | null,
  "tags": string[] (2-4 relevant professional tags based on their work/location),
  "summary": string (1-2 sentences about who they are professionally)
}

Respond ONLY with valid JSON.`

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  let contact = {}
  try { contact = JSON.parse(text.trim()) } catch { /* empty */ }

  return NextResponse.json({ contact })
}
