import { useEffect, useState } from 'react'

export default function SubscriptionList({ refreshAt }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/subscriptions`)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (refreshAt) load() }, [refreshAt])

  if (loading) return <div className="text-blue-200">Cargando...</div>
  if (error) return <div className="text-red-400">{error}</div>

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Tus suscripciones</h3>
      {items.length === 0 ? (
        <p className="text-blue-200 text-sm">Aún no agregaste suscripciones.</p>
      ) : (
        <ul className="divide-y divide-slate-700/60">
          {items.map((s) => (
            <li key={s.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{s.name}</p>
                <p className="text-blue-300/80 text-sm">{s.billing_cycle} • {s.currency} {s.amount}</p>
              </div>
              {s.next_charge_date && (
                <span className="text-xs text-blue-200/70">Próximo: {new Date(s.next_charge_date).toLocaleDateString()}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
