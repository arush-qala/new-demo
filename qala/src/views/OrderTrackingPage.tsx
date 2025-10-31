import React from 'react'
import { useParams } from 'react-router-dom'

const mockEvents = [
  { ts: '2025-10-30 10:12', status: 'Order confirmed', carrier: 'Qala' },
  { ts: '2025-11-02 08:40', status: 'Picked up by DHL', carrier: 'DHL' },
  { ts: '2025-11-03 14:22', status: 'In transit - Delhi Hub', carrier: 'DHL' },
  { ts: '2025-11-05 09:05', status: 'Customs cleared', carrier: 'DHL' },
  { ts: '2025-11-06 16:10', status: 'Out for delivery', carrier: 'DHL' },
]

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display">Order #{orderId}</h1>
      <div className="glass rounded-xl p-6">
        <div className="text-sm text-neutral-300 mb-4">Carrier events (mocked DHL API)</div>
        <div className="space-y-3">
          {mockEvents.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-1 h-2.5 w-2.5 rounded-full ${i===mockEvents.length-1?'bg-gold':'bg-white/30'}`} />
              <div className="text-sm">
                <div className="text-neutral-200">{e.status}</div>
                <div className="text-neutral-400 text-xs">{e.ts} • {e.carrier}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

