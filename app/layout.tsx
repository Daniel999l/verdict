import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Verdict | Does your idea deserve to exist?',
  description: 'Paste your product idea. Get a brutally honest AI verdict in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* NOVUS SCRIPT GOES HERE */}
      </head>
      <body className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-secondary selection:text-on-secondary">
        {children}
      </body>
    </html>
  )
}
