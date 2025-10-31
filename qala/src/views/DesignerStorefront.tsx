import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'

const AccentDivider: React.FC = () => (
  <div className="h-px w-full bg-gradient-to-r from-gold/60 via-gold/30 to-transparent" />
)

export const DesignerStorefront: React.FC = () => {
  const { brandSlug } = useParams()
  const { brands, collections } = useStore()
  const brand = brands.find(b => b.slug === brandSlug)
  const brandCollections = collections.filter(c => c.brandSlug === brandSlug)

  return (
    <div className="space-y-10">
      <nav className="text-xs text-neutral-400">
        <Link to="/" className="hover:text-neutral-200">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-300">{brand?.name || brandSlug}</span>
      </nav>
      <section className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-4">
          <img
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop"
            className="w-full h-[420px] object-cover rounded-xl"
          />
          <div className="space-y-4">
            <h1 className="text-3xl font-display">{brand?.name || brandSlug}</h1>
            <AccentDivider />
            <p className="text-sm text-neutral-300 max-w-2xl">
              {brand?.tagline || 'Contemporary fashion with Indian artisanship.'} Explore the brand journey, sustainable practices, and editorial features.
            </p>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="glass rounded-xl p-5">
            <div className="font-medium mb-2 tracking-wide">Brand Story</div>
            <p className="text-sm text-neutral-300">Founded in 2014, championing handcrafted textiles, natural dyes, and timeless silhouettes crafted by Indian artisans.</p>
          </div>
          <div className="glass rounded-xl p-5">
            <div className="font-medium mb-2 tracking-wide">Press & Features</div>
            <ul className="text-sm text-neutral-300 list-disc pl-5 space-y-1">
              <li>Featured in Vogue India</li>
              <li>Showcased at Lakmé Fashion Week</li>
              <li>IFCI Design Excellence 2023</li>
            </ul>
          </div>
          <div className="glass rounded-xl p-0 overflow-hidden">
            <div className="p-5 font-medium mb-0 tracking-wide">Production</div>
            <AccentDivider />
            <video controls className="w-full">
              <source src="https://cdn.coverr.co/videos/coverr-a-woman-sewing-5028/1080p.mp4" type="video/mp4" />
            </video>
          </div>
        </aside>
      </section>

      <section>
        <h2 className="text-xl font-display mb-4">Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brandCollections.map((c) => (
            <Link to={`/brand/${brandSlug}/collections/${c.slug}`} key={c.slug} className="group rounded-xl overflow-hidden glass block">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={c.cover} className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="p-4 text-sm flex items-center justify-between">
                <span>{c.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 group-hover:text-neutral-200">View</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

