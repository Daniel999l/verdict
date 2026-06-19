import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { buildSystemPrompt } from '@/lib/prompt'
import { VerdictResult } from '@/lib/types'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { idea, competitorUrl } = await req.json()

    if (!idea || typeof idea !== 'string' || idea.trim().length < 20) {
      return NextResponse.json({ error: 'Idea too short' }, { status: 400 })
    }

    // Fetch competitor context via Jina reader (no API key needed)
    let competitorContext = ''
    if (competitorUrl && typeof competitorUrl === 'string' && competitorUrl.trim()) {
      try {
        const jinaRes = await fetch(`https://r.jina.ai/${competitorUrl.trim()}`, {
          headers: { Accept: 'text/plain' },
          signal: AbortSignal.timeout(5000),
        })
        if (jinaRes.ok) {
          const text = await jinaRes.text()
          competitorContext = text.slice(0, 2000)
        }
      } catch {
        // Silent fail, proceed without competitor context
      }
    }

    const userMessage = competitorContext
      ? `Product idea:\n${idea.trim()}\n\nCompetitor context:\n${competitorContext}`
      : `Product idea:\n${idea.trim()}`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1200,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: userMessage },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'

    // Strip markdown code fences if model wraps the output
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    // Extract JSON object in case of any preamble
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : cleaned

    const parsed = JSON.parse(jsonStr) as VerdictResult

    // Sanity check required fields
    if (
      typeof parsed.score !== 'number' ||
      !parsed.summary ||
      !parsed.personas?.skeptic ||
      !parsed.greenFlags ||
      !parsed.redFlags
    ) {
      return NextResponse.json({ error: 'Invalid AI response structure' }, { status: 500 })
    }

    // Clamp score to 0-100
    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)))

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Analyze error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
