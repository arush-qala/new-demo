import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'

export const CheckoutPage: React.FC = () => {
  const { setAddress, address, kitItems, bulkOrders, products, clearBulk, clearKit } = useStore()
  const navigate = useNavigate()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setAddress({
      company: String(fd.get('company')||''),
      contactName: String(fd.get('contactName')||''),
      email: String(fd.get('email')||''),
      phone: String(fd.get('phone')||''),
      line1: String(fd.get('line1')||''),
      city: String(fd.get('city')||''),
      state: String(fd.get('state')||''),
      country: String(fd.get('country')||''),
      postalCode: String(fd.get('postalCode')||''),
    })
    const fakeId = Math.floor(Math.random()*1e6).toString()
    clearKit(); clearBulk()
    navigate(`/order/${fakeId}/track`)
  }

  const kitSelected = kitItems
    .map(k => products.find(p => p.slug === k.productSlug))
    .filter(Boolean)

  return (
    <div className="grid md:grid-cols-2 gap-10 items-start">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="text-2xl font-display">Shipping Address</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="company" placeholder="Company" className="glass rounded-md px-3 py-2 text-sm" defaultValue={address?.company} required />
          <input name="contactName" placeholder="Contact name" className="glass rounded-md px-3 py-2 text-sm" defaultValue={address?.contactName} required />
          <input name="email" type="email" placeholder="Email" className="glass rounded-md px-3 py-2 text-sm" defaultValue={address?.email} required />
          <input name="phone" placeholder="Phone" className="glass rounded-md px-3 py-2 text-sm" defaultValue={address?.phone} required />
          <input name="line1" placeholder="Address line" className="glass rounded-md px-3 py-2 text-sm md:col-span-2" defaultValue={address?.line1} required />
          <input name="city" placeholder="City" className="glass rounded-md px-3 py-2 text-sm" defaultValue={address?.city} required />
          <input name="state" placeholder="State" className="glass rounded-md px-3 py-2 text-sm" defaultValue={address?.state} required />
          <input name="country" placeholder="Country" className="glass rounded-md px-3 py-2 text-sm" defaultValue={address?.country} required />
          <input name="postalCode" placeholder="Postal code" className="glass rounded-md px-3 py-2 text-sm" defaultValue={address?.postalCode} required />
        </div>
        <button className="glass rounded-lg px-4 py-2 text-sm hover:bg-white/5 transition">Place Order</button>
      </form>
      <aside className="space-y-4">
        <motion.div className="glass rounded-xl p-5" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
          <div className="font-medium mb-3">Brand Kit</div>
          {kitSelected.length===0 ? (
            <div className="text-sm text-neutral-400">No items in kit.</div>
          ) : (
            <ul className="space-y-3">
              {kitSelected.map((p) => (
                <li key={p!.slug} className="flex items-center gap-3 text-sm">
                  <img src={p!.cover} className="h-12 w-10 object-cover rounded" />
                  <div>{p!.name}</div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
        <motion.div className="glass rounded-xl p-5" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.05}}>
          <div className="font-medium mb-3">Bulk Orders</div>
          {bulkOrders.length===0 ? (
            <div className="text-sm text-neutral-400">No bulk items.</div>
          ) : (
            <div className="space-y-2 text-sm">
              {bulkOrders.map((bo, idx) => {
                const p = products.find(pp => pp.slug === bo.productSlug)
                const summary = Object.entries(bo.sizeQty).filter(([_,q])=>q && q>0).map(([s,q])=>`${s}: ${q}`).join(', ')
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <img src={p?.cover} className="h-12 w-10 object-cover rounded" />
                    <div>
                      <div>{p?.name}</div>
                      <div className="text-xs text-neutral-400">{summary}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </aside>
    </div>
  )
}

