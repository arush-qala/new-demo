import React from 'react'
import { Link } from 'react-router-dom'

const demoBrands = [
  { slug: 'khara-kapas', name: 'Khara Kapas', tagline: 'Pure cotton, pure style', hero: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'raw-mango', name: 'Raw Mango', tagline: 'Contemporary Indian design', hero: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop' },
]

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <section className="rounded-2xl overflow-hidden relative">
        <img src={demoBrands[0].hero} className="w-full h-[360px] object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-3xl md:text-5xl font-display">Discover India’s Top Designers</h1>
          <p className="text-neutral-300 mt-2 max-w-xl">Curated for luxury multi-designer boutiques and retail stores.</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-display mb-4">Featured Designers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoBrands.map((b) => (
            <Link to={`/brand/${b.slug}`} key={b.slug} className="group rounded-xl overflow-hidden glass block">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={b.hero} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="p-5">
                <div className="text-lg font-medium">{b.name}</div>
                <div className="text-sm text-neutral-400">{b.tagline}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

