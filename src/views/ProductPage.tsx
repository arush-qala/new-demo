import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { FittingRoom } from '@/components/Three/FittingRoom'
import { Runway } from '@/components/Three/Runway'
import { BrandKitOverlay } from '@/components/BrandKitOverlay'

// Product images - using local images from public/images/products folder
// For evening-dress-aurum: official product photography from Khara Kapas
const productImages: Record<string, string[]> = {
  'evening-dress-aurum': [
    '/images/products/0-42_1_1583f7d9-340d-409e-bfe8-ed4a3fe101e7.jpg', // View 1
    '/images/products/0-44_2_cd62e9f6-b52f-4ef4-8aac-b2e3309b9150.jpg', // View 2
    '/images/products/0-45_1_cd41aff5-caf7-47fa-98dc-a6940209715e.jpg', // View 3
    '/images/products/0-43_1_075f40cb-d2f8-4d90-bb93-50d3895a6c69.jpg', // View 4
    '/images/products/0-41_1_84c14f45-3a2d-4f66-95cd-7a203fb82f1e.jpg', // View 5
  ],
}

const getDefaultImages = (productSlug?: string, product?: { cover: string }): string[] => {
  if (productSlug && productImages[productSlug]) {
    return productImages[productSlug]
  }
  // Fallback - use product cover image with variations
  if (product?.cover) {
    return [
      product.cover,
      product.cover.replace('w=1600', 'w=1200').replace('q=80', 'q=75'),
      product.cover,
      product.cover,
      product.cover,
    ]
  }
  // Default fashion images
  return [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
  ]
}

export const ProductPage: React.FC = () => {
  const { productSlug } = useParams()
  const [spinIndex, setSpinIndex] = useState(0)
  const [isBrandKitOpen, setIsBrandKitOpen] = useState(false)
  const { products } = useStore()
  const product = products.find(p => p.slug === productSlug)
  const productImageSet = getDefaultImages(productSlug, product)

  return (
    <>
      <BrandKitOverlay
        isOpen={isBrandKitOpen}
        onClose={() => setIsBrandKitOpen(false)}
        brandSlug={product?.brandSlug || ''}
        productSlug={productSlug}
      />
    <div className="space-y-10">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-ink/50">
            <img 
              src={productImageSet[spinIndex % productImageSet.length]} 
              alt={product?.name || 'Product view'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {productImageSet.map((s, i) => (
              <button 
                key={i} 
                onClick={() => setSpinIndex(i)} 
                className={`flex-shrink-0 h-20 w-16 rounded-lg overflow-hidden border transition-all ${i===spinIndex?'border-gold ring-2 ring-gold/30':'border-white/10 hover:border-white/20'}`}
              >
                <img src={s} alt={`View ${i+1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-display">{productSlug?.replace('-', ' ').toUpperCase()}</h1>
            <div className="text-neutral-400 text-sm mt-1">Handcrafted evening dress with delicate embroidery</div>
          </div>
          <div className="text-sm text-neutral-300">
            • Pure silk crepe • Mother-of-pearl buttons • Hand embroidery
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setIsBrandKitOpen(true)} className="glass rounded-lg py-3 text-sm">Order Brand Kit</button>
            <Link to={`/bulk-order/${productSlug}`} className="glass rounded-lg py-3 text-sm text-center">Bulk Order</Link>
          </div>
          <Link to="/kit" className="text-xs text-neutral-300 hover:text-white">Go to Brand Kit</Link>
          <div className="text-xs text-neutral-400">Ships via DHL / FedEx. Lead time: 3-4 weeks.</div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-display">Virtual Fitting Room</h2>
        <FittingRoom productImage={productImageSet[0]} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-display">Runway Preview</h2>
        {/* Runway uses ModelAvatar component - same realistic woman model as Fitting Room */}
        <Runway productImage={productImageSet[0]} />
      </section>
    </div>
    </>
  )
}

