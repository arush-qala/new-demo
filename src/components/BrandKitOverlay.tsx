import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useStore } from '@/store/useStore'

type BrandKitOverlayProps = {
  isOpen: boolean
  onClose: () => void
  brandSlug: string
  productSlug?: string
}

// Brand goodies/keepsakes - these would come from brand data in production
const brandGoodies: Record<string, Array<{ id: string; name: string; description: string; image?: string }>> = {
  'khara-kapas': [
    { id: 'wooden-block', name: 'Wooden Hand Block', description: 'Traditional hand-carved wooden block for block printing' },
    { id: 'fabric-swatch', name: 'Cotton Fabric Swatch Set', description: 'Collection of premium cotton fabric samples' },
    { id: 'brand-catalog', name: 'Brand Catalog', description: 'Latest collection catalog with detailed craftsmanship notes' },
    { id: 'care-instructions', name: 'Care Instructions Card', description: 'Premium printed care and maintenance guide' },
  ],
  'raw-mango': [
    { id: 'silk-sample', name: 'Pure Silk Sample', description: 'Premium silk fabric swatch from our collection' },
    { id: 'embroidery-guide', name: 'Embroidery Guide', description: 'Artisan embroidery techniques and patterns' },
    { id: 'brand-book', name: 'Brand Story Book', description: 'Beautifully illustrated brand story and heritage' },
    { id: 'craftsmanship-card', name: 'Craftsmanship Card', description: 'Details about our artisanal techniques' },
  ],
  'sabyasachi': [
    { id: 'crystal-brooch', name: 'Crystal Brooch', description: 'Signature crystal-embellished collectible' },
    { id: 'heritage-book', name: 'Heritage Book', description: 'Limited edition book on Indian textile heritage' },
    { id: 'gold-thread', name: 'Gold Thread Sample', description: 'Pure gold thread used in our embroidery' },
    { id: 'design-sketch', name: 'Designer Sketch', description: 'Authentic design sketch from our archive' },
  ],
  'anita-dongre': [
    { id: 'eco-fabric', name: 'Sustainable Fabric Sample', description: 'Eco-friendly fabric swatch collection' },
    { id: 'sustainability-guide', name: 'Sustainability Guide', description: 'Our commitment to sustainable fashion' },
    { id: 'brand-journal', name: 'Brand Journal', description: 'Creative journal with design inspirations' },
    { id: 'artisan-story', name: 'Artisan Story Card', description: 'Stories from our artisan partners' },
  ],
}

export const BrandKitOverlay: React.FC<BrandKitOverlayProps> = ({ isOpen, onClose, brandSlug, productSlug }) => {
  const { products, addKitItem } = useStore()
  const [selectedProducts, setSelectedProducts] = useState<string[]>(productSlug ? [productSlug] : [])
  const [selectedGoodies, setSelectedGoodies] = useState<string[]>([])
  const [address, setAddress] = useState({
    company: '',
    contactName: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  })
  
  // Get products from the same brand (limit to 3)
  const brandProducts = products
    .filter(p => p.brandSlug === brandSlug && p.slug !== productSlug)
    .slice(0, 3)
  
  const goodies = brandGoodies[brandSlug] || []
  
  const toggleProduct = (slug: string) => {
    if (selectedProducts.length >= 3 && !selectedProducts.includes(slug)) return
    setSelectedProducts(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    )
  }
  
  const toggleGoodie = (id: string) => {
    setSelectedGoodies(prev => 
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }
  
  const handleSubmit = () => {
    // Add selected products to kit
    selectedProducts.forEach(slug => addKitItem(slug))
    
    // In production, this would submit to an API
    console.log('Brand Kit Order:', {
      brandSlug,
      products: selectedProducts,
      goodies: selectedGoodies,
      address,
    })
    
    // Close overlay and show success
    onClose()
    alert('Brand Kit order submitted successfully!')
  }
  
  const isValid = address.company && address.contactName && address.phone && 
                  address.line1 && address.city && address.country && 
                  selectedProducts.length > 0
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display">Order Brand Kit</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Brand Goodies Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Brand Goodies & Keepsakes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {goodies.map(goodie => (
                      <label
                        key={goodie.id}
                        className="glass rounded-lg p-4 cursor-pointer hover:bg-white/5 transition border border-transparent hover:border-gold/30"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGoodies.includes(goodie.id)}
                          onChange={() => toggleGoodie(goodie.id)}
                          className="mr-3"
                        />
                        <div className="inline-block">
                          <div className="font-medium text-sm">{goodie.name}</div>
                          <div className="text-xs text-neutral-400">{goodie.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Products Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Select Products (up to 3)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {brandProducts.map(product => {
                      const isSelected = selectedProducts.includes(product.slug)
                      const isDisabled = !isSelected && selectedProducts.length >= 3
                      
                      return (
                        <label
                          key={product.slug}
                          className={`glass rounded-lg overflow-hidden cursor-pointer transition ${
                            isSelected 
                              ? 'ring-2 ring-gold border-gold' 
                              : isDisabled
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-white/5 border border-transparent hover:border-white/20'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProduct(product.slug)}
                            disabled={isDisabled}
                            className="hidden"
                          />
                          <div className="aspect-[4/5] overflow-hidden">
                            <img src={product.cover} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-3">
                            <div className="text-sm font-medium">{product.name}</div>
                            <div className="text-xs text-neutral-400">₹{product.price.toLocaleString('en-IN')}</div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {selectedProducts.length} of 3 products selected
                  </div>
                </div>
                
                {/* Shipping Address Form */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Shipping Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">Company Name</label>
                      <input
                        type="text"
                        value={address.company}
                        onChange={(e) => setAddress({...address, company: e.target.value})}
                        className="glass w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">Contact Name</label>
                      <input
                        type="text"
                        value={address.contactName}
                        onChange={(e) => setAddress({...address, contactName: e.target.value})}
                        className="glass w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">Phone Number</label>
                      <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                        className="glass w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">Address Line 1</label>
                      <input
                        type="text"
                        value={address.line1}
                        onChange={(e) => setAddress({...address, line1: e.target.value})}
                        className="glass w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        className="glass w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">State</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({...address, state: e.target.value})}
                        className="glass w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">Country</label>
                      <input
                        type="text"
                        value={address.country}
                        onChange={(e) => setAddress({...address, country: e.target.value})}
                        className="glass w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none"
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 mb-1 block">Postal Code</label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                        className="glass w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-gold outline-none"
                        placeholder="Postal code"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className={`flex-1 glass rounded-lg py-3 text-sm font-medium transition ${
                      isValid 
                        ? 'hover:bg-white/10' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Complete Brand Kit Order
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 glass rounded-lg py-3 text-sm hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

