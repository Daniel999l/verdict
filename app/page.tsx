'use client'

import { useState, useEffect } from 'react'
import { VerdictResult } from '@/lib/types'
import InputView from '@/components/InputView'
import LoadingView from '@/components/LoadingView'
import ResultsView from '@/components/ResultsView'

declare global {
  interface Window {
    pendo?: {
      track: (eventName: string, properties?: Record<string, string | number | boolean>) => void
    }
  }
}

type View = 'input' | 'loading' | 'results'

export default function Home() {
  useEffect(() => {
    pendo.initialize({ visitor: { id: '' } });
  }, []);

  const [view, setView] = useState<View>('input')
  const [idea, setIdea] = useState('')
  const [competitorUrl, setCompetitorUrl] = useState('')
  const [result, setResult] = useState<VerdictResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    if (idea.trim().length < 50) return
    setView('loading')
    setError(null)

    const trimmedUrl = competitorUrl.trim()
    let competitorDomain = ''
    if (trimmedUrl) {
      try { competitorDomain = new URL(trimmedUrl).hostname } catch { /* invalid URL */ }
    }

    window.pendo?.track('idea_analysis_submitted', {
      idea_length: idea.trim().length,
      has_competitor_url: trimmedUrl.length > 0,
      competitor_url_domain: competitorDomain,
    })

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim(), competitorUrl: competitorUrl.trim() }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Analysis failed')
      }

      const data: VerdictResult = await res.json()

      // Persist to localStorage for history
      try {
        const entry = { idea: idea.trim(), result: data, timestamp: Date.now() }
        localStorage.setItem('verdict_latest', JSON.stringify(entry))
        const history = JSON.parse(localStorage.getItem('verdict_history') ?? '[]')
        history.unshift(entry)
        localStorage.setItem('verdict_history', JSON.stringify(history.slice(0, 20)))

        window.pendo?.track('analysis_history_saved', {
          history_count: Math.min(history.length, 20),
          score: data.score,
          idea_length: idea.trim().length,
        })
      } catch {
        // localStorage unavailable in some environments, not critical
      }

      window.pendo?.track('analysis_completed', {
        score: data.score,
        score_category: data.score >= 80 ? 'strong' : data.score >= 65 ? 'viable' : data.score >= 40 ? 'uncertain' : 'high_risk',
        skeptic_rating: data.personas.skeptic.rating,
        user_rating: data.personas.user.rating,
        engineer_rating: data.personas.engineer.rating,
        investor_rating: data.personas.investor.rating,
        green_flags_count: data.greenFlags.length,
        red_flags_count: data.redFlags.length,
        idea_length: idea.trim().length,
        has_competitor_url: trimmedUrl.length > 0,
      })

      setResult(data)
      setView('results')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Try again.'

      window.pendo?.track('analysis_failed', {
        error_message: msg.substring(0, 100),
        idea_length: idea.trim().length,
        has_competitor_url: trimmedUrl.length > 0,
      })

      setError(msg)
      setView('input')
    }
  }

  function handleReset() {
    setView('input')
    setIdea('')
    setCompetitorUrl('')
    setResult(null)
    setError(null)
  }

  return (
    <>
      {view === 'input' && (
        <InputView
          idea={idea}
          setIdea={setIdea}
          competitorUrl={competitorUrl}
          setCompetitorUrl={setCompetitorUrl}
          onAnalyze={handleAnalyze}
          error={error}
        />
      )}
      {view === 'loading' && <LoadingView />}
      {view === 'results' && result && (
        <ResultsView result={result} onReset={handleReset} idea={idea} />
      )}
    </>
  )
}
