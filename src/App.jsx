import { useState } from 'react'
import SubscriptionForm from './components/SubscriptionForm'
import SubscriptionList from './components/SubscriptionList'
import Summary from './components/Summary'

function App() {
  const [refreshAt, setRefreshAt] = useState(0)
  const triggerRefresh = () => setRefreshAt(Date.now())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]" />

      <header className="relative z-10 px-6 py-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Centralizador de Suscripciones</h1>
        <p className="text-blue-200 mt-2">Controla tus gastos, recibe alertas y evita duplicados</p>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SubscriptionForm onCreated={triggerRefresh} />
            <SubscriptionList refreshAt={refreshAt} />
          </div>
          <div>
            <Summary refreshAt={refreshAt} />
            <div className="mt-6 bg-slate-800/50 border border-blue-500/20 rounded-xl p-5 text-blue-200 text-sm">
              <p className="mb-2 font-semibold text-white">Monetización (MVP)</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Gratis: registro manual y resumen básico</li>
                <li>Premium: automatizaciones y recomendaciones</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center text-blue-300/60 text-sm pb-8">
        Hecho con Flames Blue
      </footer>
    </div>
  )
}

export default App
