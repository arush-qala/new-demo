import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export const BrandKitPage: React.FC = () => {
  const { products, kitItems, removeKitItem, clearKit } = useStore()
  const selected = kitItems.map(k => products.find(p => p.slug === k.productSlug)).filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display">Brand Kit</h1>
        <button onClick={clearKit} className="text-xs text-neutral-400 hover:text-neutral-200">Clear</button>
      </div>
      {selected.length === 0 ? (
        <div className="text-sm text-neutral-400">Pick up to 3 products from product pages to add to your kit.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selected.map((p) => (
            <motion.div key={p!.slug} className="glass rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="aspect-[4/5] overflow-hidden">
                <img src={p!.cover} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-sm">
                <div>{p!.name}</div>
                <div className="text-neutral-400 text-xs">MSRP ₹{p!.price.toLocaleString('en-IN')}</div>
                <button onClick={() => removeKitItem(p!.slug)} className="mt-2 text-xs text-red-300">Remove</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <div className="flex gap-3">
        <Link to="/checkout" className={`glass px-4 py-2 rounded-lg text-sm ${selected.length===0?'pointer-events-none opacity-50':''}`}>Continue to Address</Link>
        <Link to="/" className="text-sm text-neutral-300 hover:text-white">Add more products</Link>
      </div>
    </div>
  )
}

