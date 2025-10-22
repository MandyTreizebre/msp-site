'use client'
import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import axios from 'axios'

const WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

// Regroupe {weekday,start,end} -> [{weekday, ranges: ["08:00 à 13:30", "14:30 à 19:45"]}]
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

export default function ProfessionalsSection() {
  const { slug } = useParams()
  const [professionals, setProfessionals] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    axios.get(`/api/professionals/${slug}`)
      .then((res) => setProfessionals(res.data))
      .catch(() => setError("Une erreur s’est produite lors de la récupération des professionnels."))
  }, [slug])

  return (
    <section>
      <h1>Professionnels – {slug}</h1>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {professionals.map((pro) => (
        <div key={pro.id} className="mb-6 border rounded-lg p-4">
          <p className="font-semibold text-lg">{pro.name}</p>
          <p className="text-sm">{pro.address}</p>
          <p className="text-sm mb-2">{pro.telephone}</p>

          {(!pro.weekly_hours || pro.weekly_hours.length === 0) ? (
            <p className="italic text-gray-500">Horaires non renseignés</p>
          ) : (
            <ul className="text-sm list-disc pl-4">
              {groupByDay(pro.weekly_hours).map(day => (
                <li key={day.weekday}>
                  {WEEKDAYS[day.weekday]} — {day.ranges.join(' - ')}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  )
}
