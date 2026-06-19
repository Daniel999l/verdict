'use client'

interface InputViewProps {
  idea: string
  setIdea: (v: string) => void
  competitorUrl: string
  setCompetitorUrl: (v: string) => void
  onAnalyze: () => void
  error: string | null
}

const MIN_CHARS = 50

export default function InputView({
  idea,
  setIdea,
  competitorUrl,
  setCompetitorUrl,
  onAnalyze,
  error,
}: InputViewProps) {
  const trimmed = idea.trim()
  const isValid = trimmed.length >= MIN_CHARS
  const remaining = MIN_CHARS - trimmed.length

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col overflow-x-hidden selection:bg-secondary selection:text-on-secondary">
      {/* Header */}
      <header className="bg-surface w-full border-b-[3px] border-primary neobrutal-shadow flex justify-between items-center px-gutter py-4 z-50 sticky top-0">
        <span className="text-headline-md font-black text-primary uppercase tracking-tighter">
          Verdict
        </span>
        <div className="flex items-center gap-2">
          <span className="bg-secondary text-on-secondary px-2 py-1 border-[2px] border-primary font-label-caps text-label-caps font-bold">
            BETA
          </span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center">
        {/* Hero */}
        <section className="w-full max-w-7xl px-gutter pt-20 pb-32 flex flex-col items-center text-center">
          <div className="inline-block bg-tertiary-container text-on-tertiary-container px-4 py-2 border-[3px] border-primary mb-8 font-label-caps text-label-caps uppercase tracking-widest neobrutal-shadow-sm">
            AI Product Review Panel
          </div>

          <h1 className="font-headline-lg text-headline-lg uppercase mb-12 max-w-4xl tracking-tighter leading-none">
            DOES YOUR IDEA{' '}
            <span className="bg-secondary text-white px-4">DESERVE TO EXIST?</span>
          </h1>

          <div className="w-full max-w-3xl flex flex-col gap-6">
            {/* Idea textarea */}
            <div className="bg-white border-[3px] border-primary p-2 neobrutal-shadow-lg transition-all focus-within:translate-x-[4px] focus-within:translate-y-[4px] focus-within:shadow-none">
              <div className="flex justify-between items-center px-4 py-2 bg-surface-container-high border-b-[3px] border-primary mb-2">
                <span className="font-label-caps text-label-caps uppercase font-bold">
                  Your Idea
                </span>
                <span className="font-label-caps text-label-caps text-outline">
                  {idea.length} chars
                </span>
              </div>
              <textarea
                className="w-full h-48 p-6 font-code-sm text-code-sm bg-transparent border-none focus:ring-0 resize-none placeholder:text-outline"
                placeholder="Describe your product idea. What does it do, who is it for, and what problem does it solve..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>

            {/* Competitor URL */}
            <div className="bg-white border-[3px] border-primary p-2 neobrutal-shadow-sm transition-all focus-within:translate-x-[4px] focus-within:translate-y-[4px] focus-within:shadow-none">
              <div className="flex justify-between items-center px-4 py-2 bg-surface-container-high border-b-[3px] border-primary mb-2">
                <span className="font-label-caps text-label-caps uppercase font-bold">Competitor URL</span>
                <span className="font-label-caps text-label-caps text-outline">(optional)</span>
              </div>
              <input
                type="url"
                className="w-full px-6 py-3 font-code-sm text-code-sm bg-transparent outline-none border-none focus:ring-0 placeholder:text-outline"
                placeholder="https://competitor.com"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="border-[3px] border-error bg-error/10 px-6 py-4 font-label-caps text-label-caps text-error uppercase">
                {error}
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button
                onClick={onAnalyze}
                disabled={!isValid}
                className="bg-secondary text-on-secondary border-[3px] border-primary px-12 py-6 font-label-caps text-headline-md uppercase neobrutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all flex items-center gap-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:neobrutal-shadow"
              >
                Get Verdict
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
              </button>

              {!isValid && trimmed.length > 0 && (
                <span className="font-label-caps text-label-caps text-outline uppercase">
                  {remaining} more chars needed
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Ticker */}
        <div className="w-full bg-primary py-4 overflow-hidden border-y-[3px] border-primary relative flex items-center">
          <div className="flex whitespace-nowrap animate-marquee items-center gap-12 text-white font-label-caps text-label-caps uppercase tracking-widest">
            <span>// Panel Status: Active</span>
            <span className="w-2 h-2 bg-secondary inline-block" />
            <span>// 4 Critics Standing By</span>
            <span className="w-2 h-2 bg-secondary inline-block" />
            <span>// Zero Bias. Zero Mercy.</span>
            <span className="w-2 h-2 bg-secondary inline-block" />
            <span>// Average Score: 54 / 100</span>
            <span className="w-2 h-2 bg-secondary inline-block" />
            <span>// Panel Status: Active</span>
            <span className="w-2 h-2 bg-secondary inline-block" />
            <span>// 4 Critics Standing By</span>
            <span className="w-2 h-2 bg-secondary inline-block" />
            <span>// Zero Bias. Zero Mercy.</span>
          </div>
        </div>
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
