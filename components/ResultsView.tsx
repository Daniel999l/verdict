'use client'

import { VerdictResult } from '@/lib/types'

interface ResultsViewProps {
  result: VerdictResult
  onReset: () => void
  idea: string
}

type PersonaKey = keyof VerdictResult['personas']

interface PersonaMeta {
  key: PersonaKey
  label: string
  sub: string
  icon: string
  iconBg: string
}

const PERSONAS: PersonaMeta[] = [
  { key: 'skeptic',  label: 'The Skeptic',  sub: 'Risk Analysis',    icon: 'person',      iconBg: 'bg-error' },
  { key: 'user',     label: 'The User',     sub: 'Desirability',     icon: 'person_search', iconBg: 'bg-hot-pink' },
  { key: 'engineer', label: 'The Engineer', sub: 'Technical Load',   icon: 'bolt',        iconBg: 'bg-secondary' },
  { key: 'investor', label: 'The Investor', sub: 'Market Viability', icon: 'trending_up', iconBg: 'bg-on-tertiary-fixed-variant' },
]

function getScoreMeta(score: number) {
  if (score >= 80) return { label: 'STRONG',    scoreColor: 'text-[#00CC33]', badgeBg: 'bg-toxic-green', badgeText: 'text-black' }
  if (score >= 65) return { label: 'VIABLE',    scoreColor: 'text-secondary', badgeBg: 'bg-secondary',   badgeText: 'text-white' }
  if (score >= 40) return { label: 'UNCERTAIN', scoreColor: 'text-[#FF9900]', badgeBg: 'bg-[#FF9900]',  badgeText: 'text-black' }
  return             { label: 'HIGH RISK', scoreColor: 'text-error',     badgeBg: 'bg-error',      badgeText: 'text-white' }
}

export default function ResultsView({ result, onReset, idea }: ResultsViewProps) {
  const meta = getScoreMeta(result.score)

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-secondary selection:text-on-secondary">
      {/* Header */}
      <header className="flex justify-between items-center px-gutter py-4 w-full bg-surface border-b-[3px] border-primary neobrutal-shadow sticky top-0 z-50">
        <span className="text-headline-md font-black text-primary uppercase tracking-tighter">
          Verdict
        </span>
        <button
          onClick={onReset}
          className="bg-secondary text-on-secondary border-[3px] border-primary px-6 py-2 font-label-caps text-label-caps uppercase neobrutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          New Analysis
        </button>
      </header>

      <main className="flex-1 p-gutter pb-32 max-w-7xl mx-auto w-full">

        {/* Score + Summary */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 mt-8 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full border-[6px] border-black bg-white flex flex-col items-center justify-center neobrutal-shadow">
              <span className="font-label-caps text-label-caps text-primary uppercase mb-2">
                Verdict Score
              </span>
              <h1 className={`font-display text-display leading-none ${meta.scoreColor}`}>
                {result.score}
              </h1>
              <div
                className={`absolute -top-4 -right-4 ${meta.badgeBg} ${meta.badgeText} border-[3px] border-black px-4 py-2 font-code-sm neobrutal-shadow-sm`}
              >
                {meta.label}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="neobrutal-border bg-white p-8 neobrutal-shadow">
              <h2 className="font-headline-lg text-headline-lg mb-4 uppercase">
                Execution Summary
              </h2>
              <p className="font-body-lg text-body-lg mb-6 leading-relaxed">
                {result.summary}
              </p>
              <div className="border-t-[3px] border-primary pt-4">
                <p className="font-label-caps text-label-caps text-outline uppercase truncate">
                  Idea: {idea.slice(0, 90)}{idea.length > 90 ? '...' : ''}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Critics Panels */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter mb-8">
          {PERSONAS.map((persona) => {
            const data = result.personas[persona.key]
            return (
              <div
                key={persona.key}
                className="neobrutal-border bg-white p-6 neobrutal-shadow neobrutal-shadow-hover transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-12 h-12 neobrutal-border ${persona.iconBg} flex items-center justify-center text-white`}
                  >
                    <span className="material-symbols-outlined">{persona.icon}</span>
                  </div>
                  <span className="font-code-sm bg-black text-white px-2 py-1 text-sm">
                    {data.rating}/10
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-1">{persona.label}</h3>
                <p className="font-label-caps text-label-caps text-secondary mb-3 uppercase">
                  {persona.sub}
                </p>
                <p className="font-body-md text-body-md italic border-l-[3px] border-black pl-4 text-on-surface-variant">
                  {data.verdict}
                </p>
              </div>
            )
          })}
        </section>

        {/* Flags + MVP + Validate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-8">

          {/* Flags column */}
          <div className="space-y-gutter">
            <div className="neobrutal-border bg-white neobrutal-shadow">
              <div className="bg-error text-white p-4 border-b-[3px] border-black flex items-center gap-4">
                <span className="material-symbols-outlined">flag</span>
                <h2 className="font-headline-md text-headline-md uppercase">Red Flags</h2>
              </div>
              <ul className="divide-y-[3px] divide-black font-label-caps text-label-caps">
                {result.redFlags.map((flag, i) => (
                  <li key={i} className="p-4 flex gap-4 items-start bg-error/10">
                    <span className="text-error font-black text-xl shrink-0">X</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="neobrutal-border bg-white neobrutal-shadow">
              <div className="bg-toxic-green text-black p-4 border-b-[3px] border-black flex items-center gap-4">
                <span className="material-symbols-outlined">check_circle</span>
                <h2 className="font-headline-md text-headline-md uppercase">Green Flags</h2>
              </div>
              <ul className="divide-y-[3px] divide-black font-label-caps text-label-caps">
                {result.greenFlags.map((flag, i) => (
                  <li key={i} className="p-4 flex gap-4 items-start">
                    <span className="text-[#00CC33] font-black text-xl shrink-0">&#10003;</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MVP + Validate column */}
          <div className="flex flex-col gap-gutter">
            <div className="neobrutal-border bg-white neobrutal-shadow flex-1">
              <div className="bg-black text-white p-4 border-b-[3px] border-black">
                <h2 className="font-headline-md text-headline-md uppercase">Real MVP Scope</h2>
              </div>
              <div className="p-gutter">
                <p className="font-body-lg text-body-lg leading-relaxed">{result.mvpScope}</p>
              </div>
            </div>

            <div className="neobrutal-border neobrutal-shadow flex-1" style={{ background: '#0040e0' }}>
              <div className="bg-black text-white p-4 border-b-[3px] border-black">
                <h2 className="font-headline-md text-headline-md uppercase">Validate This First</h2>
              </div>
              <div className="p-gutter">
                <p className="font-body-lg text-white leading-relaxed">{result.validateFirst}</p>
              </div>
            </div>
          </div>
        </div>

        {/* New Analysis CTA */}
        <section className="neobrutal-border bg-primary text-white p-gutter neobrutal-shadow flex flex-col md:flex-row justify-between items-center gap-gutter">
          <div>
            <h2 className="font-headline-md text-headline-md uppercase mb-1">
              Analyze Another Idea
            </h2>
            <p className="font-body-md opacity-70">
              Got another hypothesis? Run it through the panel.
            </p>
          </div>
          <button
            onClick={onReset}
            className="bg-toxic-green text-black border-[3px] border-black px-12 py-4 font-label-caps text-label-caps neobrutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase whitespace-nowrap"
          >
            New Analysis
          </button>
        </section>
      </main>

      <footer className="bg-surface text-primary border-t-[3px] border-primary w-full flex justify-between items-center px-gutter py-stack-md">
        <span className="font-label-caps text-label-caps font-black uppercase">Verdict v1.0.0</span>
        <span className="font-label-caps text-label-caps text-outline uppercase hidden md:block">
          Built for World Product Day 2026
        </span>
      </footer>
    </div>
  )
}
