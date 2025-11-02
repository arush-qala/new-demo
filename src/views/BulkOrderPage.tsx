import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore, allSizes } from '@/store/useStore'

export const BulkOrderPage: React.FC = () => {
  const { productSlug } = useParams()
  const { products, setBulkQty, bulkOrders } = useStore()
  const product = products.find(p => p.slug === productSlug)
  const current = bulkOrders.find(b => b.productSlug === productSlug)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">Bulk Order • {product?.name}</h1>
      <div className="glass rounded-xl p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-neutral-400">
            <tr>
              {allSizes.map(s => (<th key={s} className="px-2 py-2 font-normal">{s}</th>))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {allSizes.map(s => (
                <td key={s} className="px-2 py-2">
                  <input type="number" min={0} className="w-20 glass rounded px-2 py-1"
                    value={current?.sizeQty[s] || 0}
                    onChange={(e)=> setBulkQty(productSlug!, s, Number(e.target.value))} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex gap-3">
        <Link to="/checkout" className="glass rounded-lg px-4 py-2 text-sm">Proceed to Checkout</Link>
        <Link to={`/product/${productSlug}`} className="text-sm text-neutral-300 hover:text-white">Back to product</Link>
      </div>
    </div>
  )
}

