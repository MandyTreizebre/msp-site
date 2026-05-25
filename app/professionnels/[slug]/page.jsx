'use client'
import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import ProfessionalCard from '../../../components/ProfessionalCard'
import "../../../styles/Professionals.css"

export default function ProfessionalsSection() {
  const { slug } = useParams()
  const [professionals, setProfessionals] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/professionals/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau")
        return res.json()
      })
      .then((data) => setProfessionals(data))
      .catch((err) => {
        console.error(err)
        setError("Une erreur s'est produite lors de la récupération des professionnels.")
      })
  }, [slug])

  return (
    <section className="pros-section">
      {error && <div className="pros-error">{error}</div>}
      <div className="pros-grid">
        {professionals.map((pro) => (
          <ProfessionalCard key={pro.id} pro={pro} />
        ))}
      </div>
    </section>
  )
}