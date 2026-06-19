'use client'

import { useState, useEffect } from 'react'
import { VerdictResult } from '@/lib/types'
import InputView from '@/components/InputView'
import LoadingView from '@/components/LoadingView'
import ResultsView from '@/components/ResultsView'

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
      } catch {
        // localStorage unavailable in some environments, not critical
      }

      setResult(data)
      setView('results')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Try again.'
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
