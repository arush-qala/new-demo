import React from 'react'
import { Link, useParams } from 'react-router-dom'

const demoProducts = [
  { slug: 'evening-dress-aurum', name: 'Aurum Evening Dress', price: 28000, cover: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'cotton-kurta-elara', name: 'Elara Cotton Kurta', price: 14000, cover: 'https://images.unsplash.com/photo-1483985973882-3ef63f6f7f8e?q=80&w=1600&auto=format&fit=crop' },
]

export const CollectionPage: React.FC = () => {
  const { brandSlug, collectionSlug } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display">
          {brandSlug} / {collectionSlug}
        </h1>
        <div className="text-sm text-neutral-400">Showing {demoProducts.length} products</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoProducts.map((p) => (
          <Link to={`/product/${p.slug}`} key={p.slug} className="group block glass rounded-xl overflow-hidden">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={p.cover} className="w-full h-full object-cover group-hover:scale-105 transition" />
            </div>
            <div className="p-4">
              <div className="text-sm">{p.name}</div>
              <div className="text-xs text-neutral-400">MSRP ₹{p.price.toLocaleString('en-IN')}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

