import { useState } from 'react'

export default function SubscriptionForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    currency: 'USD',
    billing_cycle: 'monthly',
    next_charge_date: '',
    payment_method: '',
    tags: '',
    notes: '',
    active: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        name: form.name.trim(),
        amount: parseFloat(form.amount || 0),
        currency: form.currency.trim().toUpperCase(),
        billing_cycle: form.billing_cycle,
        next_charge_date: form.next_charge_date || null,
        payment_method: form.payment_method || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : null,
        notes: form.notes || null,
        active: !!form.active,
      }

      const res = await fetch(`${baseUrl}/api/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || `Error ${res.status}`)
      }

      setSuccess('Suscripción guardada')
      setForm({
        name: '', amount: '', currency: 'USD', billing_cycle: 'monthly',
        next_charge_date: '', payment_method: '', tags: '', notes: '', active: true,
      })
      onCreated?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Agregar suscripción</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Nombre del servicio</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="block text-sm text-blue-200 mb-1">Importe</label>
            <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required
              className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-blue-200 mb-1">Moneda</label>
            <input name="currency" value={form.currency} onChange={handleChange} maxLength={3}
              className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Ciclo</label>
          <select name="billing_cycle" value={form.billing_cycle} onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="monthly">Mensual</option>
            <option value="annual">Anual</option>
            <option value="weekly">Semanal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Próximo cobro</label>
          <input type="date" name="next_charge_date" value={form.next_charge_date} onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Método de pago</label>
          <input name="payment_method" value={form.payment_method} onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Etiquetas (coma)</label>
          <input name="tags" value={form.tags} onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-blue-200 mb-1">Notas</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
            className="w-full px-3 py-2 rounded bg-slate-900/70 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-2">
          <input id="active" type="checkbox" name="active" checked={form.active} onChange={handleChange}
            className="h-4 w-4" />
          <label htmlFor="active" className="text-blue-200 text-sm">Activa</label>
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded transition-colors">
            {submitting ? 'Guardando...' : 'Guardar'}
          </button>
          {error && <span className="text-red-400 text-sm self-center">{error}</span>}
          {success && <span className="text-emerald-400 text-sm self-center">{success}</span>}
        </div>
      </form>
    </div>
  )
}
