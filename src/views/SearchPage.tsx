import React, { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export const SearchPage: React.FC = () => {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase()
  const { brands, products } = useStore()

  const brandMatches = useMemo(() => brands.filter(b => (
    b.name.toLowerCase().includes(q) || (b.tagline?.toLowerCase().includes(q))
  )), [brands, q])

  const productMatches = useMemo(() => products.filter(p => (
    p.name.toLowerCase().includes(q)
  )), [products, q])

  return (
    <div className="space-y-8">
      <div className="text-sm text-neutral-400">Results for "{q}"</div>
      <section>
        <h2 className="text-lg font-display mb-3">Brands</h2>
        {brandMatches.length === 0 && <div className="text-sm text-neutral-400">No brands found.</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brandMatches.map(b => (
            <Link to={`/brand/${b.slug}`} key={b.slug} className="glass p-4 rounded-xl text-sm hover:bg-white/5">
              <div className="font-medium">{b.name}</div>
              <div className="text-neutral-400">{b.tagline}</div>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-display mb-3">Products</h2>
        {productMatches.length === 0 && <div className="text-sm text-neutral-400">No products found.</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productMatches.map(p => (
            <Link to={`/product/${p.slug}`} key={p.slug} className="glass rounded-xl overflow-hidden block">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={p.cover} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-sm">
                <div>{p.name}</div>
                <div className="text-neutral-400 text-xs">MSRP ₹{p.price.toLocaleString('en-IN')}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

