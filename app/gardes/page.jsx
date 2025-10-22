'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function GardesPage() {
  const [pros, setPros] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().slice(0, 10)

  // helper format HH:MM
  const fmtHM = (d) =>
    new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/guardes?date=${today}`)
      .then(res => {
        setPros(res.data || [])
        setError(null)
      })
      .catch(() => setError("Une erreur s’est produite lors du chargement des gardes."))
      .finally(() => setLoading(false))
  }, [today])

  if (loading) return <p>Chargement des gardes…</p>
  if (error)   return <p style={{color:'red'}}>{error}</p>

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Gardes du {today}</h1>

      {pros.length === 0 ? (
        <p>Aucun professionnel trouvé.</p>
      ) : (
        pros.map((pro) => (
          <article key={pro.id} className="mb-4 border rounded-lg p-4 shadow-sm bg-white">
            <h2 className="font-semibold text-lg">{pro.name}</h2>
            <p className="text-sm text-gray-600">{pro.address}</p>
            <p className="text-sm text-gray-600 mb-2">{pro.telephone}</p>

            {/* Statut dynamique calculé par le DAL */}
            {pro.status?.label && (
              <p className="mb-2 font-medium">
                {pro.status.label}
              </p>
            )}

            {/* Créneaux du jour (fusionnés hebdo + exceptions) */}
            {(!pro.slots || pro.slots.length === 0) ? (
              <p className="italic text-gray-500">Aucun créneau aujourd’hui.</p>
            ) : (
              <ul className="text-sm text-gray-800 list-disc pl-5">
                {pro.slots.map((s, i) => (
                  <li key={i}>
                    {fmtHM(s.start)} – {fmtHM(s.end)}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))
      )}
    </section>
  )
}
