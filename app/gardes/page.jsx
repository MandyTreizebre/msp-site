'use client'
import { useEffect, useState } from 'react'
import "../../styles/Gardes.css"

export default function GardesPage() {
  const [pros, setPros] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/availability')
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau")
        return res.json()
      })
      .then((data) => {
        setPros(data)
        setError(null)
      })
      .catch((err) => {
        console.error(err)
        setError("Une erreur s'est produite lors du chargement des disponibilités.")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="gardes-loading">Chargement…</p>
  if (error) return <p className="gardes-error">{error}</p>

  const open = pros.filter(p => p.status === 'open')
  const openingSoon = pros.filter(p => p.status === 'opening_soon')
  const guards = pros.filter(p => p.status === 'guard')
  const replacements = pros.filter(p => p.status === 'replacement')

  return (
    <section className="gardes-section">
      {open.length > 0 && (
        <div className="gardes-group">
          <h2 className="gardes-group-title">Actuellement ouverts</h2>
          {open.map(pro => <ProCard key={pro.id} pro={pro} />)}
        </div>
      )}

      {openingSoon.length > 0 && (
        <div className="gardes-group">
          <h2 className="gardes-group-title">Ouvre aujourd'hui</h2>
          {openingSoon.map(pro => <ProCard key={pro.id} pro={pro} />)}
        </div>
      )}

      {guards.length > 0 && (
        <div className="gardes-group">
          <h2 className="gardes-group-title">De garde ce soir</h2>
          {guards.map(pro => <ProCard key={pro.id} pro={pro} />)}
        </div>
      )}

      {replacements.length > 0 && (
        <div className="gardes-group">
          <h2 className="gardes-group-title">Remplacements</h2>
          {replacements.map(pro => <ProCard key={pro.id} pro={pro} />)}
        </div>
      )}

      {pros.length === 0 && (
        <p className="gardes-empty">Aucun professionnel disponible aujourd'hui.</p>
      )}
    </section>
  )
}

function ProCard({ pro }) {
  return (
    <article className="gardes-card">
      <div className="gardes-card-header">
        <h3 className="gardes-card-name">{pro.name}</h3>
        <span className={`gardes-badge gardes-badge--${pro.status}`}>
          {pro.message}
        </span>
      </div>
      <div className="gardes-card-body">
        {pro.address && <p className="gardes-card-info">{pro.address}</p>}
        {pro.telephone && (
          <a href={`tel:${pro.telephone}`} className="gardes-card-phone">
            {pro.telephone}
          </a>
        )}
        {pro.status === 'replacement' && pro.replacement && (
          <div className="gardes-replacement">
            <p className="gardes-replacement-name">Remplaçant : {pro.replacement.name}</p>
            {pro.replacement.telephone && (
              <a href={`tel:${pro.replacement.telephone}`} className="gardes-card-phone">
                {pro.replacement.telephone}
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}