import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { SearchBar } from '@/components/SearchBar'

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-ink text-neutral-100">
      <header className="sticky top-0 z-20 bg-gradient-to-b from-ink/95 to-ink/70 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-display tracking-wide text-white hover:text-white/90 transition-colors">
            Qala
          </Link>
          <SearchBar />
          <nav className="text-sm text-neutral-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 py-10 text-xs text-neutral-400">
        <div className="mx-auto max-w-7xl px-6">© Qala Prototype</div>
      </footer>
    </div>
  )
}

