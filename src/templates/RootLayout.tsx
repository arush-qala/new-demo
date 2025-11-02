import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'

export const RootLayout: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-ink text-neutral-100">
      <header className="sticky top-0 z-20 bg-gradient-to-b from-ink/95 to-ink/70 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-display tracking-wide">
            Qala
          </Link>
          <form
            onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); const q = String(fd.get('q')||''); navigate(`/search?q=${encodeURIComponent(q)}`) }}
            className="w-full max-w-xl mx-6 hidden md:block"
          >
            <input name="q" className="w-full glass rounded-full px-5 py-3 text-sm placeholder:text-neutral-400" placeholder="AI Search: e.g., evening dress cotton embroidery blue..." />
          </form>
          <nav className="text-sm text-neutral-300">
            <Link to="/" className="hover:text-white">Home</Link>
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

