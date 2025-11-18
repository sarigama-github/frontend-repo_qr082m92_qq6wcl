import { useEffect, useState } from 'react'

export default function Summary({ refreshAt }) {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/insights/summary`)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setSummary(data)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (refreshAt) load() }, [refreshAt])

  if (error) return <div className="text-red-400">{error}</div>
  if (!summary) return <div className="text-blue-200">Cargando resumen...</div>

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Resumen mensual</h3>
      <p className="text-2xl font-bold text-white mb-2">${summary.total_monthly}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(summary.services).map(([name, value]) => (
          <div key={name} className="flex items-center justify-between bg-slate-900/60 px-3 py-2 rounded">
            <span className="text-blue-100 capitalize">{name}</span>
            <span className="text-white font-semibold">${value}</span>
          </div>
        ))}
      </div>
      {summary.duplicates && summary.duplicates.length > 0 && (
        <div className="mt-4 text-amber-300 text-sm">
          Posibles duplicados: {summary.duplicates.join(', ')}
        </div>
      )}
    </div>
  )
}
