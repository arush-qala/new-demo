import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { FittingRoom } from '@/components/Three/FittingRoom'
import { Runway } from '@/components/Three/Runway'

const sampleSpin = [
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop',
]

export const ProductPage: React.FC = () => {
  const { productSlug } = useParams()
  const [spinIndex, setSpinIndex] = useState(0)
  const { addKitItem } = useStore()

  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="aspect-[4/5] overflow-hidden rounded-xl">
            <img src={sampleSpin[spinIndex % sampleSpin.length]} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            {sampleSpin.map((s, i) => (
              <button key={i} onClick={() => setSpinIndex(i)} className={`h-16 w-16 rounded-lg overflow-hidden border ${i===spinIndex?'border-gold':'border-white/10'}`}>
                <img src={s} className="w-full h-full object-cover" />
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
            <button onClick={()=>{ if(productSlug) { addKitItem(productSlug) } }} className="glass rounded-lg py-3 text-sm">Add to Brand Kit</button>
            <Link to={`/bulk-order/${productSlug}`} className="glass rounded-lg py-3 text-sm text-center">Bulk Order</Link>
          </div>
          <Link to="/kit" className="text-xs text-neutral-300 hover:text-white">Go to Brand Kit</Link>
          <div className="text-xs text-neutral-400">Ships via DHL / FedEx. Lead time: 3-4 weeks.</div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-display">Virtual Fitting Room</h2>
        <FittingRoom />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-display">Runway Preview</h2>
        <Runway modelUrl="https://models.readyplayer.me/6615b7e0834cb1a3ea5f9c95.glb" />
      </section>
    </div>
  )
}

