'use client'
import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import "../../../styles/Professionals.css"

const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

function groupByDay(weekly_hours = []) {
  const map = new Map()
  for (const h of weekly_hours) {
    if (h?.weekday == null) continue
    const arr = map.get(h.weekday) || []
    arr.push({ start: h.start, end: h.end })
    map.set(h.weekday, arr)
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([weekday, ranges]) => ({
      weekday,
      ranges: ranges
        .sort((a, b) => a.start.localeCompare(b.start))
        .map(r => `${r.start} à ${r.end}`)
    }))
}

function ProfessionalCard({ pro }) {
  const hasHours = pro.weekly_hours && pro.weekly_hours.length > 0

  return (
    <article className="pro-card">
      <div className="pro-card-main">
        <header className="pro-card-header">
          <h3 className="pro-name">{pro.name}</h3>
        </header>

        <div className="pro-card-body">
          {pro.address && (
            <p className="pro-line">
              <span> <FontAwesomeIcon icon={faLocationDot} className="pro-icon" /> </span>
              <span>
                <span className="pro-label">Adresse :</span> {pro.address}
              </span>
            </p>
          )}
          {pro.telephone && (
            <p className="pro-line">
              <span > <FontAwesomeIcon icon={faPhone} className="pro-icon"/> </span>
              <span>
                <span className="pro-label">Téléphone :</span> <a className="pro-phone" href={`tel:${pro.telephone}`}>
                  {pro.telephone}
                </a>
              </span>
            </p>
          )}
        </div>
      </div>

      {hasHours ? (
        <div className="pro-hours">
          <p className="pro-hours-title">Horaires de consultation</p>
          <ul className="pro-hours-list">
            {groupByDay(pro.weekly_hours).map(day => (
              <li key={day.weekday}>
                <span className="pro-hours-day">
                  {WEEKDAYS[day.weekday]}
                </span>
                <span className="pro-hours-ranges">
                  {day.ranges.join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="pro-hours">
          <p className="pro-no-hours">Horaires non renseignés.</p>
        </div>
      )}
    </article>
  )
}

export default function ProfessionalsSection() {
  const { slug } = useParams()
  const [professionals, setProfessionals] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    axios.get(`/api/professionals/${slug}`)
      .then((res) => setProfessionals(res.data))
      .catch(() =>
        setError("Une erreur s’est produite lors de la récupération des professionnels.")
      )
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
