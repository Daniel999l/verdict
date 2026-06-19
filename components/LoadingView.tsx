export default function LoadingView() {
  return (
    <div className="bg-background min-h-screen flex flex-col overflow-x-hidden selection:bg-secondary selection:text-on-secondary">
      <header className="bg-surface w-full border-b-[3px] border-primary neobrutal-shadow flex items-center px-gutter py-4 z-50 sticky top-0">
        <span className="text-headline-md font-black text-primary uppercase tracking-tighter">
          Verdict
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-gutter">
        <div className="border-[3px] border-primary neobrutal-shadow bg-white p-16 flex flex-col items-center gap-8 max-w-md w-full text-center">
          <span className="material-symbols-outlined text-6xl text-secondary animate-spin">
            sync
          </span>
          <div>
            <p className="font-headline-md text-headline-md uppercase mb-2">
              Consulting the Panel
            </p>
            <p className="font-label-caps text-label-caps text-outline uppercase">
              4 critics reviewing your idea...
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {['SKEPTIC', 'USER', 'ENGINEER', 'INVESTOR'].map((name) => (
              <span
                key={name}
                className="font-label-caps text-[10px] bg-surface-container border-[2px] border-primary px-3 py-1 uppercase"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
