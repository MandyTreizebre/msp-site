import { query } from "../db"

const SLUGS = ['medecins', 'pharmacie']

class AvailabilityDAL {
  static async getAvailableToday() {
    try {
      const now = new Date()
      const currentTime = now.toTimeString().slice(0, 5) // "Heure actuelle, HH:MM"     
      const currentWeekday = now.getDay() // Jour de la semaine, 0 = dimanche
      const today = now.toISOString().slice(0, 10) // Date du jour,  "YYYY-MM-DD"

      const sql = `
        SELECT
          p.id,
          p.name,
          p.telephone,
          p.address,
          s.slug AS specialisation_slug,
          COALESCE(
            json_agg(
              json_build_object(
                'type',       ed.type,
                'note',       ed.note,
                'slots',      (
                  SELECT COALESCE(
                    json_agg(
                      json_build_object(
                        'start', to_char(es.start_time, 'HH24:MI'),
                        'end',   to_char(es.end_time,   'HH24:MI')
                      )
                      ORDER BY es.start_time
                    ),
                    '[]'
                  )
                  FROM exception_slots es
                  WHERE es.exception_day_id = ed.id
                ),
                'replacement', (
                  SELECT json_build_object(
                    'name',      r.name,
                    'telephone', r.telephone
                  )
                  FROM replacements r
                  WHERE r.exception_day_id = ed.id
                  LIMIT 1
                )
              )
            ) FILTER (WHERE ed.id IS NOT NULL),
            '[]'
          ) AS exceptions,
          COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
                'weekday',  wh.weekday,
                'start',    to_char(wh.start_time, 'HH24:MI'),
                'end',      to_char(wh.end_time,   'HH24:MI')
              )
            ) FILTER (WHERE wh.id IS NOT NULL AND wh.weekday = $1),
            '[]'
          ) AS today_weekly_hours
        FROM professionals p
        JOIN specialisations s ON s.id = p.specialisation_id
        LEFT JOIN exception_days ed ON ed.professional_id = p.id AND ed.date = $2
        LEFT JOIN weekly_hours wh ON wh.professional_id = p.id
        WHERE s.slug = ANY($3)
        GROUP BY p.id, s.slug
      `

      const rows = await query(sql, [currentWeekday, today, SLUGS])
      return rows
        .map(pro => computeStatus(pro, currentTime))
        .filter(pro => pro.status !== null)

    } catch (err) {
      console.error("Erreur AvailabilityDAL :", err)
      throw new Error("Erreur serveur : Impossible de récupérer les disponibilités")
    }
  }
}

function computeStatus(pro, currentTime) {
  const exceptions = pro.exceptions || []
  const weeklySlots = pro.today_weekly_hours || []

  const hasClose = exceptions.some(e => e.type === 'close')
  if (hasClose) return { ...pro, status: null }

  const replaceEx = exceptions.find(e => e.type === 'replace')
  const guardEx = exceptions.find(e => e.type === 'guard')
  const replacementEx = exceptions.find(e => e.type === 'replacement')

  const slots = replaceEx ? replaceEx.slots : weeklySlots

  const currentSlot = slots.find(s => s.start <= currentTime && currentTime < s.end)
  if (currentSlot) {
    return {
      ...pro,
      status: 'open',
      message: `Ouvert jusqu'à ${currentSlot.end}`
    }
  }

  const nextSlot = slots
    .filter(s => s.start > currentTime)
    .sort((a, b) => a.start.localeCompare(b.start))[0]

  if (nextSlot) {
    return {
      ...pro,
      status: 'opening_soon',
      message: `Ouvre aujourd'hui à ${nextSlot.start}`
    }
  }

  if (guardEx && guardEx.slots.length > 0) {
    const guardSlot = guardEx.slots
      .filter(s => s.end > currentTime)
      .sort((a, b) => a.start.localeCompare(b.start))[0]

    if (guardSlot) {
      return {
        ...pro,
        status: 'guard',
        message: `De garde de ${guardSlot.start} à ${guardSlot.end}`
      }
    }
  }

  if (replacementEx) {
    const repSlot = replacementEx.slots
      .filter(s => s.end > currentTime)
      .sort((a, b) => a.start.localeCompare(b.start))[0]

    if (repSlot && replacementEx.replacement) {
      return {
        ...pro,
        status: 'replacement',
        message: `Remplacé par ${replacementEx.replacement.name}`,
        replacement: replacementEx.replacement,
        replacementSlot: repSlot
      }
    }
  }

  return { ...pro, status: null }
}

export default AvailabilityDAL