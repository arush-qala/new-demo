import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const SearchBar: React.FC = () => {
  const navigate = useNavigate()
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setIsFocused(false)
    }
  }

  // Liquid glass effect - Apple iOS 26 style
  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-xl mx-6 hidden md:block"
    >
      {/* Glow effect when focused */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          isFocused
            ? 'bg-gradient-to-r from-white/10 via-white/5 to-white/10 blur-xl'
            : 'bg-white/0'
        }`}
        style={{
          filter: 'blur(20px)',
          transform: 'scale(1.05)',
        }}
      />
      
      {/* Main search container */}
      <div
        className={`relative rounded-2xl transition-all duration-500 ${
          isFocused
            ? 'bg-white/[0.08] backdrop-blur-2xl border border-white/20 shadow-2xl shadow-white/5'
            : 'bg-white/[0.03] backdrop-blur-xl border border-white/10'
        }`}
        style={{
          boxShadow: isFocused
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            : '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Inner glow layer */}
        <div
          className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        />
        
        {/* Input container */}
        <div className="relative flex items-center px-4 py-3">
          {/* Search icon */}
          <svg
            className={`w-4 h-4 transition-all duration-300 ${
              isFocused ? 'text-white/90' : 'text-white/40'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          
          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow click events
              setTimeout(() => setIsFocused(false), 200)
            }}
            placeholder="AI Search: evening dress cotton embroidery blue..."
            className="flex-1 ml-3 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30 focus:placeholder:text-white/20 transition-colors duration-300"
            style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          />
          
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4 text-white/50 hover:text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

